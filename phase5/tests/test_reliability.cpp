#include "reliability.hpp"
#ifdef NDEBUG
#undef NDEBUG
#endif
#include <cassert>
#include <iostream>
#include <stdexcept>
#include <vector>
using namespace mastery::phase5;
static Input limit(std::uint64_t epoch,std::uint64_t seq,const char* sym,Id id,Side side,Price price,Qty qty){return {epoch,seq,sym,Kind::Limit,id,side,price,qty};}
static Input market(std::uint64_t epoch,std::uint64_t seq,const char* sym,Id id,Side side,Qty qty){return {epoch,seq,sym,Kind::Market,id,side,0,qty};}
static Input cancel(std::uint64_t epoch,std::uint64_t seq,const char* sym,Id id){return {epoch,seq,sym,Kind::Cancel,id,Side::Buy,0,0};}
int main() {
 const std::vector<std::string> symbols={"AAPL","MSFT"};
 Venue primary(symbols);
 const std::vector<Input> tape={
  limit(1,1,"AAPL",1,Side::Sell,101,7),limit(1,2,"MSFT",2,Side::Sell,205,4),
  limit(1,3,"AAPL",3,Side::Sell,101,5),market(1,4,"AAPL",4,Side::Buy,8),
  limit(1,5,"MSFT",5,Side::Buy,202,10),limit(1,6,"AAPL",6,Side::Buy,99,3),
  cancel(1,7,"MSFT",2), limit(1,8,"MSFT",8,Side::Sell,203,5),
  market(1,9,"MSFT",9,Side::Buy,3),limit(1,10,"AAPL",10,Side::Buy,100,6)
 };
 for(std::size_t i=0;i<5;i++){const auto r=primary.apply(tape[i]);assert(r.accepted&&primary.invariant());}
 assert(primary.sequence()==5&&primary.book("AAPL").sequence()==3&&primary.book("MSFT").sequence()==2);
 const auto snapshot=primary.checkpoint();
 Venue recovered(symbols);recovered.restore(snapshot);
 assert(recovered.canonical()==primary.canonical()&&recovered.state_hash()==primary.state_hash());
 assert(recovered.checkpoint()==snapshot);
 const auto baseline=primary.canonical();
 // Missing, torn, modified or invalid snapshots MUST NOT partially update the destination.
 for(std::string damage : {snapshot.substr(0,snapshot.size()-5), snapshot+"junk", std::string("bad checkpoint")}){
  try{recovered.restore(damage);assert(false);}catch(std::invalid_argument const&){}
  assert(recovered.canonical()==baseline);
 }
 auto mut=snapshot;mut[12]='X';
 try{recovered.restore(mut);assert(false);}catch(std::invalid_argument const&){}
 assert(recovered.canonical()==baseline);
 assert(!recovered.apply(tape[7]).accepted);assert(recovered.sequence()==5);
 for(std::size_t i=5;i<tape.size();i++){
  auto a=primary.apply(tape[i]); auto b=recovered.apply(tape[i]);
  assert(a==b && primary.invariant()&&recovered.invariant());
  assert(primary.canonical()==recovered.canonical());
 }
 std::cout<<"REPLAY_HASH "<<primary.state_hash()<<"\n";
 std::cout<<"REPLAY_CANONICAL "<<primary.canonical()<<"\n";
 // Old leader cannot commit the next event after a promoted epoch.
 assert(recovered.promote(2));const auto afterPromotion=recovered.canonical();
 assert(recovered.apply(limit(1,11,"AAPL",11,Side::Buy,100,5)).reason=="FENCED_EPOCH");
 assert(recovered.canonical()==afterPromotion);
 assert(recovered.apply(limit(3,11,"AAPL",11,Side::Buy,100,5)).reason=="UNKNOWN_EPOCH");
 assert(recovered.apply(limit(2,13,"AAPL",11,Side::Buy,100,5)).reason=="SEQ_GAP_OR_REPLAY");
 assert(recovered.apply(limit(2,11,"AAPL",11,Side::Buy,100,5)).accepted);
 assert(recovered.apply(limit(2,11,"AAPL",11,Side::Buy,100,5)).reason=="SEQ_GAP_OR_REPLAY");
 assert(recovered.sequence()==11 && recovered.invariant());
 assert(!recovered.promote(2)&&!recovered.promote(1));
 // Business-rule rejects consume sequence, but old epochs/sequence gaps do not.
 assert(recovered.apply(limit(2,12,"NOPE",12,Side::Buy,100,1)).reason=="UNKNOWN_SYMBOL");
 assert(recovered.sequence()==12);
 assert(recovered.apply(limit(2,13,"AAPL",11,Side::Buy,100,1)).reason=="DUPLICATE_ACTIVE_ID");
 assert(recovered.sequence()==13);
 assert(recovered.invariant());
 // Snapshot queues preserve FIFO and support a strong-commit validation check.
 Exchange original;
 assert(original.process({1,Kind::Limit,81,Side::Sell,105,3}).accepted);
 assert(original.process({2,Kind::Limit,82,Side::Sell,105,5}).accepted);
 auto b=original.export_snapshot();Exchange reconstructed;reconstructed.import_snapshot(b);
 assert(reconstructed.canonical()==original.canonical());
 const auto fills=reconstructed.process({3,Kind::Market,90,Side::Buy,0,7}).fills;
 assert(fills.size()==2&&fills[0].maker==81&&fills[0].quantity==3&&fills[1].maker==82&&fills[1].quantity==4);
 const auto good=original.canonical();
 auto invalid=b;invalid.orders.push_back(b.orders.front());
 try{original.import_snapshot(invalid);assert(false);}catch(std::invalid_argument const&){}
 assert(original.canonical()==good&&original.invariant());
 // Explicit queue backpressure is atomic across all subscribers.
 BoundedFanout fanout(0);Envelope out;
 assert(fanout.subscribe("fast",3,0));assert(fanout.subscribe("slow",1,0));
 assert(!fanout.subscribe("late",3,5));
 assert(fanout.publish({1,"AAPL","q1"})=="ACCEPTED");
 assert(fanout.publish({2,"MSFT","q2"})=="BACKPRESSURE");
 assert(fanout.last_published()==1 && fanout.depth("fast")==1 && fanout.depth("slow")==1);
 assert(fanout.drain("slow",out)&&out.seq==1);
 assert(fanout.publish({2,"MSFT","q2"})=="ACCEPTED");
 assert(fanout.drain("fast",out)&&out.seq==1);
 assert(fanout.drain("fast",out)&&out.seq==2);
 assert(fanout.drain("slow",out)&&out.seq==2);
 assert(fanout.delivered("fast")==2 &&fanout.last_published()==2);
 assert(fanout.publish({2,"AAPL","replay"})=="SEQ_GAP_OR_REPLAY");
 // Deterministic seeded randomized multi-symbol streaming and snapshot recoveries.
 Venue stressed(symbols);std::uint64_t seed=0xBEEF;
 auto rand=[&](){seed=seed*2862933555777941757ULL+3037000493ULL;return seed;};
 for(std::uint64_t i=1;i<=4000;i++){
   const auto r=rand(); const char* sym=(r&1)?"AAPL":"MSFT";
   Input e=(i%13==0)?cancel(1,i,sym,1000+(r%300)):i%7==0?market(1,i,sym,100000+i,(r&2)?Side::Buy:Side::Sell,static_cast<Qty>(r%30+1))
     :limit(1,i,sym,100000+i,(r&2)?Side::Buy:Side::Sell,static_cast<Price>(100+r%10),static_cast<Qty>(r%30+1));
   stressed.apply(e); assert(stressed.invariant());
   if(i%500==0){auto cp=stressed.checkpoint();Venue fresh(symbols);fresh.restore(cp);assert(fresh.canonical()==stressed.canonical());}
 }
 std::cout<<"PASS native snapshots + restore + delta + fencing + FIFO + backpressure + 4000 seeded invariant events\n";
}