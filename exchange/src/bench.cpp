#include "exchange.hpp"
#include <algorithm>
#include <chrono>
#include <cstdint>
#include <iostream>
#include <numeric>
#include <random>
#include <string>
#include <vector>
using namespace mastery::exchange;
using Clock=std::chrono::steady_clock;
struct Stats{std::int64_t p50,p95,p99,min,max;double mean;};
static Stats summarize(std::vector<std::int64_t> timings){
    std::sort(timings.begin(),timings.end());
    auto p=[&](double q){return timings[static_cast<std::size_t>(static_cast<double>(timings.size()-1)*q)];};
    return {p(.50),p(.95),p(.99),timings.front(),timings.back(),
        std::accumulate(timings.begin(),timings.end(),0.0)/static_cast<double>(timings.size())};
}
static void print(const char* name,const Stats& s,std::size_t n){
    std::cout<<"{\"suite\":\""<<name<<"\",\"units\":\"ns\",\"observations\":"<<n
    <<",\"p50\":"<<s.p50<<",\"p95\":"<<s.p95<<",\"p99\":"<<s.p99
    <<",\"min\":"<<s.min<<",\"max\":"<<s.max<<",\"mean\":"<<s.mean<<"}\n";
}
int main(){
    // Synthetic microbenchmark, not production latency or a robust performance comparison.
    // Single-threaded, wall-clock timing around each call; allocator and OS effects included.
    constexpr int warm=1000, n=10000;
    Exchange engine;
    std::uint64_t seq=0, sink=0;
    std::vector<Id> ids;
    std::vector<std::int64_t> cancel_ns,add_ns;
    cancel_ns.reserve(n);add_ns.reserve(n);
    for(int i=0;i<n+warm;i++){
        auto t0=Clock::now();
        const auto a=engine.process({++seq,Kind::Limit,static_cast<Id>(i+1),Side::Sell,100+i%30,10});
        auto t1=Clock::now();
        if(!a.accepted){std::cerr<<"unexpected rejected add\n";return 1;}
        if(i>=warm)add_ns.push_back(std::chrono::duration_cast<std::chrono::nanoseconds>(t1-t0).count());
        ids.push_back(i+1);
    }
    std::mt19937_64 rng{0xC0FFEE};
    std::shuffle(ids.begin(),ids.end(),rng); // deterministic cancellation order
    for(int i=0;i<n+warm;i++){
        auto t0=Clock::now();
        const auto out=engine.process({++seq,Kind::Cancel,ids[i],Side::Buy,0,0});
        auto t1=Clock::now();
        if(!out.accepted){std::cerr<<"unexpected rejected cancel\n";return 1;}
        sink+=out.accepted;
        if(i>=warm)cancel_ns.push_back(std::chrono::duration_cast<std::chrono::nanoseconds>(t1-t0).count());
    }
    if(!engine.invariant()||engine.resting_count()!=0)return 1;
    std::cout<<"{\"kind\":\"mastery-native-benchmark\",\"version\":1,\"description\":\"single-threaded synthetic event costs; not a live trading latency claim\",\"clock\":\"steady_clock\",\"samples\":[\n";
    print("limit_add",summarize(add_ns),add_ns.size());
    std::cout<<",\n";
    print("cancel_indexed",summarize(cancel_ns),cancel_ns.size());
    std::cout<<"],\"checksum\":"<<sink<<"}\n";
}