#include <algorithm>
#include <climits>
#include <iostream>
#include <numeric>
#include <random>
#include <stdexcept>
#include <string>
#include <vector>
#if defined(MASTERY_STUDENT)
#include "../include/two_sum.hpp"
#else
#include "../reference/two_sum.hpp"
#endif

static void check(bool ok, const std::string& why) {
    if (!ok) throw std::runtime_error(why);
}
static void verify(const std::vector<int>& a, int target) {
    const auto result = mastery::two_sum(a, target);
    bool exists = false;
    for (size_t i=0; i<a.size(); ++i) for(size_t j=i+1; j<a.size(); ++j)
        if (static_cast<long long>(a[i]) + a[j] == target) exists = true;
    if (!exists) { check(result.empty(), "No valid pair exists: return an empty vector"); return; }
    check(result.size()==2, "Expected exactly two indices");
    check(result[0]>=0 && result[1]>=0 && result[0]!=result[1], "Indices must be non-negative and distinct");
    check(static_cast<size_t>(result[0])<a.size() && static_cast<size_t>(result[1])<a.size(), "Index out of range");
    check(static_cast<long long>(a[result[0]]) + a[result[1]] == target, "Returned pair does not sum to target");
}
int main(){
 try {
    verify({2,7,11,15},9);verify({3,3},6);verify({1,2,4},9);
    verify({},0);verify({5},10);verify({-6,1,12},6);
    verify({INT_MAX,INT_MIN,-1,0},-1);
    std::mt19937 gen(20261104);
    std::uniform_int_distribution<int> d(-50,50);
    for (int run=0; run<1500; ++run) {
        std::vector<int> a(static_cast<size_t>(gen()%30));
        for(auto& x:a)x=d(gen);
        verify(a,d(gen));
    }
    std::cout<<"PASS two_sum: 1507 deterministic + randomized cases\n";
    return 0;
 } catch(const std::exception& e) { std::cerr<<"FAIL two_sum: "<<e.what()<<"\n";return 1; }
}