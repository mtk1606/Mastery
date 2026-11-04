#include "exchange.hpp"
#ifdef NDEBUG
#undef NDEBUG // Keep executable correctness tests active in Release builds.
#endif
#include <cassert>
#include <iostream>
#include <string>
#include <vector>
using namespace mastery::exchange;
static Event limit(std::uint64_t seq,Id id,Side side,Price p,Qty q){return {seq,Kind::Limit,id,side,p,q};}
static Event market(std::uint64_t seq,Id id,Side side,Qty q){return {seq,Kind::Market,id,side,0,q};}
static Event cancel(std::uint64_t seq,Id id){return {seq,Kind::Cancel,id,Side::Buy,0,0};}
int main(){
  // Priority is price first, FIFO second. Partial fills retain the original queue position.
  Exchange book;
  assert(book.process(limit(1,11,Side::Sell,101,7)).accepted);
  assert(book.process(limit(2,12,Side::Sell,101,4)).accepted);
  assert(book.process(limit(3,13,Side::Sell,102,5)).accepted);
  auto x=book.process(market(4,21,Side::Buy,9));
  assert(x.accepted&&x.fills.size()==2);
  assert((x.fills[0]==Fill{11,21,101,7}));
  assert((x.fills[1]==Fill{12,21,101,2}));
  assert(book.best_ask()->price==101&&book.best_ask()->quantity==2);
  assert(book.resting_count()==2&&book.invariant());
  assert(book.process(cancel(5,12)).accepted);
  assert(book.best_ask()->price==102);
  auto y=book.process(limit(6,31,Side::Buy,103,9));
  assert(y.fills.size()==1&&(y.fills[0]==Fill{13,31,102,5}));
  assert(book.best_bid()->price==103&&book.best_bid()->quantity==4);
  assert(book.invariant());
  // Rejected business rule events consume their sequence number; stream gaps do not.
  assert(book.process(limit(8,40,Side::Sell,105,3)).reason=="SEQ_GAP");
  assert(book.sequence()==6);
  assert(book.process(limit(7,31,Side::Buy,99,2)).reason=="DUPLICATE_ACTIVE_ID");
  assert(book.sequence()==7);
  assert(book.process(limit(8,40,Side::Sell,-1,3)).reason=="INVALID_PRICE");
  assert(book.process(limit(9,40,Side::Sell,105,0)).reason=="INVALID_QUANTITY");
  assert(book.process(cancel(10,404)).reason=="UNKNOWN_ORDER");
  assert(book.process(limit(11,50,Side::Sell,105,3)).accepted);
  assert(book.process(market(12,70,Side::Buy,100)).fills.size()==1); // Market IOC, no resting remainder
  assert(book.resting_count()==1&&book.best_bid()->price==103&&book.invariant());
  assert(book.process(cancel(13,31)).accepted);
  assert(book.resting_count()==0&&book.invariant());
  std::cout<<"Core price-time, cancel, partial fills, IOC, sequencing and invariant PASS\n";

  // Replay twice and compare canonical state and stable regression fingerprint.
  const std::vector<Event> tape={
    limit(1,1,Side::Buy,99,5),limit(2,2,Side::Sell,104,7),
    limit(3,3,Side::Buy,101,3),limit(4,4,Side::Sell,101,1),
    cancel(5,1),limit(6,5,Side::Sell,103,8),
    market(7,6,Side::Buy,3),limit(8,7,Side::Buy,100,6),
    limit(9,8,Side::Sell,102,2),cancel(10,5),
    market(11,9,Side::Sell,4),limit(12,10,Side::Sell,105,4)
  };
  Exchange first,second;
  for(const auto& t:tape){auto a=first.process(t),b=second.process(t);assert(a==b);assert(first.invariant()&&second.invariant());}
  assert(first.canonical()==second.canonical()&&first.state_hash()==second.state_hash());
  // Golden snapshot pinned after independent canonical serialization check.
  std::cout<<"Golden state="<<first.canonical()<<"\n";
  std::cout<<"Golden FNV1a="<<first.state_hash()<<"\n";
  assert(first.canonical()=="seq=12;trades=4;B100:7=4,;A102:8=2,;A104:2=7,;A105:10=4,;");
  assert(first.state_hash()==15719539211984847471ULL);
  // Sequential processing is not commutative; swapping events must change stream or reject.
  Exchange reversed; auto a=reversed.process(tape[1]);assert(!a.accepted&&a.reason=="SEQ_GAP");
  assert(reversed.process(tape[0]).accepted);
  assert(reversed.invariant());
  std::cout<<"Deterministic replay and gap detection PASS\n";
  // Deterministic randomized invariant stress, exercised under ASan/UBSan in CI.
  Exchange stress;
  std::uint64_t random_state=0xDA7A;
  const auto rng=[&]() {random_state=random_state*6364136223846793005ULL+1442695040888963407ULL;return random_state;};
  for(std::uint64_t i=1;i<=5000;i++){
      auto r=rng();
      const Side side=(r&1)?Side::Buy:Side::Sell;
      Event e{};
      if(i%11==0)e={i,Kind::Cancel,10001+(r%(i+1)),side,0,0};
      else if(i%7==0)e={i,Kind::Market,100000+i,side,0,static_cast<Qty>(r%40+1)};
      else e={i,Kind::Limit,10000+i,side,static_cast<Price>(95+r%11),static_cast<Qty>(r%40+1)};
      auto response=stress.process(e);
      assert(response.reason!="SEQ_GAP");
      assert(stress.invariant());
  }
  std::cout<<"5,000 deterministic randomized C++ invariant checks PASS\n";
}