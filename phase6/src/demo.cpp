#include "durable.hpp"
#include <iostream>
#include <string>
using namespace mastery::phase6;
int main(int argc,char** argv){
 if(argc!=2){std::cerr<<"Usage: durable_demo /existing/directory/orders.wal\n";return 2;}
 try{
  Journal j(argv[1],{"AAPL","MSFT"});
  std::cout<<"restored="<<j.restored_records()<<" torn_tail_bytes="<<j.discarded_torn_bytes()<<"\n";
  Request req{"deskA","order42","AAPL",Kind::Limit,42,Side::Buy,101,5};
  auto a=j.submit(req);
  auto b=j.submit(req);
  std::cout<<"first_status="<<a.status<<" accepted="<<a.response.accepted<<" seq="<<a.sequence<<"\n";
  std::cout<<"retry_status="<<b.status<<" seq="<<b.sequence<<"\n";
  std::cout<<"epoch="<<j.venue().epoch()<<" sequence="<<j.venue().sequence()<<" hash="<<j.venue().state_hash()<<"\n";
  return a.sequence==b.sequence&&j.venue().invariant()?0:1;
 }catch(std::exception const& e){std::cerr<<"Journal failed: "<<e.what()<<"\n";return 1;}
}