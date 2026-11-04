#pragma once
#include <cstdint>
#include <optional>
#include <vector>
#include <stdexcept>
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
public:
    // Return executions in priority order. Rest any unfilled limit quantity.
    std::vector<Trade> limit(uint64_t id, Side side, int64_t price, int64_t quantity){
        (void)id;(void)side;(void)price;(void)quantity;
        throw std::logic_error("TODO: implement price-time order matching");
    }
    // Never rest an unfilled market order.
    std::vector<Trade> market(Side side, int64_t quantity){
        (void)side;(void)quantity;
        throw std::logic_error("TODO: implement market execution");
    }
    bool cancel(uint64_t id){(void)id;throw std::logic_error("TODO: implement cancel");}
    std::optional<int64_t> best_bid() const{return std::nullopt;}
    std::optional<int64_t> best_ask() const{return std::nullopt;}
    int64_t depth(Side side, int64_t price) const {(void)side;(void)price;return 0;}
};
} // namespace mastery