#include <array>
#include <chrono>
#include <cstddef>
#include <cstdint>
#include <iostream>
#include <memory_resource>
#include <numeric>
#include <vector>
using Clock=std::chrono::steady_clock;
int main(){
    // The experiment is deliberately NOT marketed as a generic 'pmr is faster' result.
    // It isolates allocation lifetime for transient scratch arrays, not the exchange engine.
    constexpr std::size_t rounds=5000, size=256;
    std::uint64_t checksum=0;
    auto begin=Clock::now();
    for(std::size_t i=0;i<rounds;i++){
        std::vector<std::uint32_t> v;
        for(std::uint32_t j=0;j<size;j++)v.push_back(j);
        checksum+=std::accumulate(v.begin(),v.end(),0ULL);
    }
    auto mid=Clock::now();
    // The arena is recreated each round. The temporary vector must die before its arena.
    for(std::size_t i=0;i<rounds;i++){
        std::array<std::byte,4096> arena{};
        std::pmr::monotonic_buffer_resource resource{arena.data(),arena.size(),std::pmr::null_memory_resource()};
        std::pmr::vector<std::uint32_t> v{&resource};
        for(std::uint32_t j=0;j<size;j++)v.push_back(j);
        checksum+=std::accumulate(v.begin(),v.end(),0ULL);
    }
    auto end=Clock::now();
    std::cout<<"default_vector_ns="<<std::chrono::duration_cast<std::chrono::nanoseconds>(mid-begin).count()
      <<" pmr_monotonic_ns="<<std::chrono::duration_cast<std::chrono::nanoseconds>(end-mid).count()
      <<" rounds="<<rounds<<" checksum="<<checksum<<"\n";
    return checksum==2*rounds*(size-1)*size/2?0:1;
}