#include "reliability.hpp"
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace mastery::phase5;
static std::vector<Input> make_tape(){
 return {
  {1,1,"AAPL",Kind::Limit,1,Side::Sell,101,7},
  {1,2,"MSFT",Kind::Limit,2,Side::Sell,205,4},
  {1,3,"AAPL",Kind::Limit,3,Side::Sell,101,5},
  {1,4,"AAPL",Kind::Market,4,Side::Buy,0,8},
  {1,5,"MSFT",Kind::Limit,5,Side::Buy,202,10},
  {1,6,"AAPL",Kind::Limit,6,Side::Buy,99,3},
  {1,7,"MSFT",Kind::Cancel,2,Side::Buy,0,0},
  {1,8,"MSFT",Kind::Limit,8,Side::Sell,203,5},
  {1,9,"MSFT",Kind::Market,9,Side::Buy,0,3},
  {1,10,"AAPL",Kind::Limit,10,Side::Buy,100,6}
 };
}
int main(int argc, char** argv) {
 try {
  std::string path=(argc>1)?argv[1]:"";
  Venue original({"AAPL","MSFT"});auto tape=make_tape();
  for(std::size_t i=0;i<5;i++) if(!original.apply(tape[i]).accepted)throw std::runtime_error("initial tape invalid");
  const auto cp=original.checkpoint();
  if(!path.empty()){
   std::ofstream f(path,std::ios::binary|std::ios::trunc);
   if(!f||!(f<<cp))throw std::runtime_error("checkpoint file write failed");
  }
  Venue recovered({"AAPL","MSFT"});
  // Demo reads exactly what was persisted. For real crash durability, atomic
  // rename, file/directory fsync, log coordination and power-cut tests are needed.
  if(path.empty())recovered.restore(cp);
  else {
   std::ifstream f(path,std::ios::binary);
   std::string data((std::istreambuf_iterator<char>(f)),{});
   recovered.restore(data);
  }
  for(std::size_t i=5;i<tape.size();i++) {
   auto a=original.apply(tape[i]);auto b=recovered.apply(tape[i]);
   if(a!=b||original.canonical()!=recovered.canonical())throw std::runtime_error("replay differs");
  }
  const auto before=original.state_hash();
  auto stale=recovered.apply({1,10,"AAPL",Kind::Limit,11,Side::Buy,100,2});
  if(stale.accepted || stale.reason!="SEQ_GAP_OR_REPLAY")throw std::runtime_error("unexpected old event");
  if(!recovered.promote(2))throw std::runtime_error("promotion failed");
  auto fenced=recovered.apply({1,11,"AAPL",Kind::Limit,11,Side::Buy,100,2});
  if(fenced.reason!="FENCED_EPOCH")throw std::runtime_error("old leader was not fenced");
  std::cout<<"{\"events\":10,\"checkpoint_seq\":5,\"replayed_delta\":5,\"snapshot_hash\":\""
           <<before<<"\",\"recovered_hash\":\""<<original.state_hash()
           <<"\",\"fenced\":true,\"invariant\":"<<(recovered.invariant()?"true":"false")<<"}\n";
 }catch(std::exception const& ex){std::cerr<<"ERROR "<<ex.what()<<'\n';return 1;}
}