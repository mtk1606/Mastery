#include <algorithm>
#include <chrono>
#include <cstdint>
#include <iostream>
#include <numeric>
#include <vector>
#include "../reference/order_book.hpp"
#include "../reference/spsc_ring.hpp"
using Clock=std::chrono::steady_clock;
static void report(const char* name,std::vector<int64_t>& ns){
 std::sort(ns.begin(),ns.end());
 const auto p=[&](double quantile){return ns[static_cast<size_t>((ns.size()-1)*quantile)];};
 const double mean=std::accumulate(ns.begin(),ns.end(),0.0)/ns.size();
 std::cout<<name<<" observations="<<ns.size()<<" mean_ns="<<mean<<" p50_ns="<<p(.50)<<" p95_ns="<<p(.95)<<" p99_ns="<<p(.99)<<"\n";
}
int main(){
 // NOTE: Local, unsynchronized microbenchmark; NOT exchange-grade latency measurement.
 mastery::OrderBook book;
 for(uint64_t i=1;i<=1000;i++)book.limit(i,mastery::Side::Sell,1000+static_cast<int64_t>(i%50),1000);
 std::vector<int64_t> bookLat;
 bookLat.reserve(15000);
 uint64_t sink=0;
 for(int i=0;i<16000;i++){
  auto t0=Clock::now();
  const auto trades=book.market(mastery::Side::Buy,1);
  auto t1=Clock::now();
  sink+=trades.size();
  if(i>=1000)bookLat.push_back(std::chrono::duration_cast<std::chrono::nanoseconds>(t1-t0).count());
 }
 report("orderbook_1lot_market_buy",bookLat);
 mastery::SpscRing<int,1024> ring;
 std::vector<int64_t> ringLat;ringLat.reserve(50000);int out=0;
 for(int i=0;i<51000;i++){
  auto t0=Clock::now();const bool pushed=ring.push(i);const bool popped=ring.pop(out);auto t1=Clock::now();
  sink+=pushed&&popped&&out==i;
  if(i>=1000)ringLat.push_back(std::chrono::duration_cast<std::chrono::nanoseconds>(t1-t0).count());
 }
 report("spsc_push_pop_single_thread",ringLat);
 std::cout<<"sink="<<sink<<" (do not compare with other machines without controlled setup)\n";
}