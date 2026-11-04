#pragma once
#include <algorithm>
#include <cstdint>
#include <deque>
#include <functional>
#include <map>
#include <optional>
#include <stdexcept>
#include <unordered_set>
#include <vector>
namespace mastery {
enum class Side { Buy, Sell };
struct Trade {
    uint64_t maker_id{};
    Side taker_side{};
    int64_t price{};
    int64_t quantity{};
    bool operator==(const Trade&) const = default;
};
class OrderBook {
    struct Resting {uint64_t id;int64_t quantity;};
    std::map<int64_t,std::deque<Resting>,std::greater<int64_t>> bids_;
    std::map<int64_t,std::deque<Resting>> asks_;
    std::unordered_set<uint64_t> ids_;
    template<class Book> static int64_t level_qty(const Book& b,int64_t px){
        auto it=b.find(px);if(it==b.end())return 0;
        int64_t result=0;for(const auto& x:it->second)result+=x.quantity;
        return result;
    }
    template<class Book> std::vector<Trade> match(Book& opposite, Side taker,int64_t& remaining,std::optional<int64_t> limit_px){
        std::vector<Trade> out;
        while(remaining>0&&!opposite.empty()){
            auto it=opposite.begin();const auto px=it->first;
            if(limit_px && ((taker==Side::Buy && px>*limit_px)||(taker==Side::Sell&&px<*limit_px)))break;
            auto& queue=it->second;
            while(remaining>0&&!queue.empty()){
                auto& maker=queue.front();const auto traded=std::min(remaining,maker.quantity);
                out.push_back(Trade{maker.id,taker,px,traded});
                maker.quantity-=traded;remaining-=traded;
                if(maker.quantity==0){ids_.erase(maker.id);queue.pop_front();}
            }
            if(queue.empty())opposite.erase(it);
        }
        return out;
    }
public:
    std::vector<Trade> limit(uint64_t id,Side side,int64_t price,int64_t quantity){
        if(price<=0||quantity<=0)throw std::invalid_argument("price and quantity must be positive integer ticks/units");
        if(ids_.contains(id))throw std::invalid_argument("duplicate live order id");
        int64_t remaining=quantity;
        auto out=(side==Side::Buy)?match(asks_,side,remaining,price):match(bids_,side,remaining,price);
        if(remaining){
            if(side==Side::Buy)bids_[price].push_back({id,remaining});
            else asks_[price].push_back({id,remaining});
            ids_.insert(id);
        }
        return out;
    }
    std::vector<Trade> market(Side side,int64_t quantity){
        if(quantity<=0)throw std::invalid_argument("market quantity must be positive");
        return side==Side::Buy?match(asks_,side,quantity,std::nullopt):match(bids_,side,quantity,std::nullopt);
    }
    bool cancel(uint64_t id){
        if(!ids_.contains(id))return false;
        auto erase_from=[&](auto& book){
            for(auto level=book.begin();level!=book.end();++level){
                auto& queue=level->second;
                for(auto it=queue.begin();it!=queue.end();++it){
                    if(it->id!=id)continue;
                    queue.erase(it);if(queue.empty())book.erase(level);ids_.erase(id);return true;
                }
            }
            return false;
        };
        return erase_from(bids_)||erase_from(asks_);
    }
    std::optional<int64_t> best_bid() const{return bids_.empty()?std::nullopt:std::optional<int64_t>(bids_.begin()->first);}
    std::optional<int64_t> best_ask() const{return asks_.empty()?std::nullopt:std::optional<int64_t>(asks_.begin()->first);}
    int64_t depth(Side side,int64_t price) const{return side==Side::Buy?level_qty(bids_,price):level_qty(asks_,price);}
};
} // namespace mastery