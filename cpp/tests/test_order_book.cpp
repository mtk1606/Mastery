#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
#if defined(MASTERY_STUDENT)
#include "../include/order_book.hpp"
#else
#include "../reference/order_book.hpp"
#endif
using namespace mastery;
static void ck(bool ok,const char* why){if(!ok)throw std::runtime_error(why);}
int main(){
 try {
    OrderBook b;
    ck(b.limit(1,Side::Sell,101,5).empty(),"first resting sell");
    ck(b.limit(2,Side::Sell,101,7).empty(),"second resting sell");
    ck(b.limit(3,Side::Sell,102,10).empty(),"third resting sell");
    ck(b.best_ask()==101&&b.depth(Side::Sell,101)==12,"best ask / depth");
    auto t=b.market(Side::Buy,8);
    ck(t.size()==2,"must match two makers");
    ck(t[0]==Trade{1,Side::Buy,101,5},"FIFO maker 1 first");
    ck(t[1]==Trade{2,Side::Buy,101,3},"partial maker 2");
    ck(b.depth(Side::Sell,101)==4,"remaining level qty");
    ck(b.cancel(2)&&!b.cancel(2),"cancel idempotency return code");
    ck(b.best_ask()==102,"best ask moved");
    ck(b.limit(9,Side::Buy,100,2).empty(),"non-crossing bid rests");
    ck(b.best_bid()==100,"best bid");
    ck(b.market(Side::Sell,1)==std::vector<Trade>{Trade{9,Side::Sell,100,1}},"market sell consumes bid");
    auto crossed=b.limit(10,Side::Buy,104,12);
    ck(crossed==std::vector<Trade>{Trade{3,Side::Buy,102,10}},"crossing price/time and remainder");
    ck(b.depth(Side::Buy,104)==2,"residual buy should rest");
    ck(!b.best_ask(),"asks fully depleted");
    bool invalid=false;try{b.limit(10,Side::Buy,105,1);}catch(const std::invalid_argument&){invalid=true;}
    ck(invalid,"reject duplicate live id");
    ck(b.cancel(10),"cancel resting remainder");
    invalid=false;try{b.limit(11,Side::Buy,0,1);}catch(const std::invalid_argument&){invalid=true;}
    ck(invalid,"reject nonpositive price");
    invalid=false;try{b.market(Side::Buy,0);}catch(const std::invalid_argument&){invalid=true;}
    ck(invalid,"reject nonpositive market quantity");
    OrderBook ordering;
    ordering.limit(40,Side::Buy,100,3);
    ordering.limit(41,Side::Buy,101,2);
    auto p=ordering.market(Side::Sell,4);
    ck(p==std::vector<Trade>({Trade{41,Side::Sell,101,2},Trade{40,Side::Sell,100,2}}),"best price before earlier timestamp");
    std::cout<<"PASS order book: priority, partial fills, crossing, cancel, invalid orders\n";
    return 0;
 }catch(const std::exception& e){std::cerr<<"FAIL order book: "<<e.what()<<"\n";return 1;}
}