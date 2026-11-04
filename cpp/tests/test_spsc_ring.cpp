#include <atomic>
#include <chrono>
#include <iostream>
#include <stdexcept>
#include <string>
#include <thread>
#if defined(MASTERY_STUDENT)
#include "../include/spsc_ring.hpp"
#else
#include "../reference/spsc_ring.hpp"
#endif
static void check(bool ok,const char* msg){if(!ok)throw std::runtime_error(msg);}
int main(){
 try {
    mastery::SpscRing<int,4> q;int value=-1;
    check(!q.pop(value),"empty pop should fail");
    for(int i=0;i<4;i++)check(q.push(i),"should accept all N slots");
    check(!q.push(5),"push when full should fail");
    for(int i=0;i<4;i++){check(q.pop(value),"pop should succeed");check(value==i,"FIFO violated");}
    check(!q.pop(value),"empty after draining");
    for(int i=5;i<35;i++){check(q.push(i),"wraparound push");check(q.pop(value)&&value==i,"wraparound pop");}
    constexpr int COUNT=100000;
    mastery::SpscRing<int,127> concurrent;
    std::atomic<bool> bad{false};
    std::thread producer([&]{for(int i=1;i<=COUNT;i++){while(!concurrent.push(i))std::this_thread::yield();}});
    std::thread consumer([&]{int v;for(int i=1;i<=COUNT;i++){while(!concurrent.pop(v))std::this_thread::yield();if(v!=i)bad.store(true);}});
    producer.join();consumer.join();
    check(!bad.load(),"FIFO or visibility failed in concurrent test");
    std::cout<<"PASS SPSC: boundary, wraparound, 100000 cross-thread transfers\n";
    return 0;
 }catch(const std::exception& e){std::cerr<<"FAIL SPSC: "<<e.what()<<"\n";return 1;}
}