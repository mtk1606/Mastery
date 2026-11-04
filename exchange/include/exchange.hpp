#pragma once
// Mastery · deterministic exchange simulation · educational reference implementation
// C++20, no external dependencies. Integer prices are TICKS, never floating-point currency.
#include <algorithm>
#include <cstdint>
#include <functional>
#include <list>
#include <map>
#include <optional>
#include <sstream>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

namespace mastery::exchange {
using Id = std::uint64_t;
using Price = std::int64_t;
using Qty = std::uint32_t;
enum class Side { Buy, Sell };
enum class Kind { Limit, Market, Cancel };
inline const char* name(Side s) { return s == Side::Buy ? "BUY" : "SELL"; }

struct Event {
    std::uint64_t seq{}; Kind kind{}; Id id{}; Side side{}; Price price{}; Qty quantity{};
};
struct Fill {
    Id maker{}, taker{}; Price price{}; Qty quantity{};
    bool operator==(const Fill&) const = default;
};
struct Outcome {
    bool accepted{};
    std::string reason;
    std::vector<Fill> fills;
    bool operator==(const Outcome&) const = default;
};
struct Quote { Price price{}; std::uint64_t quantity{}; };

class Exchange {
    struct Resting { Id id; Qty remaining; };
    using Level = std::list<Resting>;
    using Bids = std::map<Price, Level, std::greater<Price>>;
    using Asks = std::map<Price, Level>;
    struct Location { Side side; Price price; Level::iterator node; };
    Bids bids_;
    Asks asks_;
    std::unordered_map<Id, Location> by_id_;
    std::uint64_t seq_{0};
    std::uint64_t trades_{0};
    static constexpr Qty max_order_qty = 1'000'000;
    static constexpr Price max_price = 1'000'000'000'000LL;

    // Iterator stability: std::list iterators survive inserts and unrelated erasures.
    template <class Levels>
    void match(Levels& opposite, Event const& e, Qty& remaining, Outcome& out) {
        while (remaining > 0 && !opposite.empty()) {
            auto level = opposite.begin();
            const Price maker_price = level->first;
            if (e.kind == Kind::Limit &&
                ((e.side == Side::Buy && maker_price > e.price) ||
                 (e.side == Side::Sell && maker_price < e.price))) break;
            auto& fifo = level->second;
            while (remaining > 0 && !fifo.empty()) {
                auto it = fifo.begin();
                Qty fill_qty = std::min(remaining, it->remaining);
                out.fills.push_back({it->id, e.id, maker_price, fill_qty});
                ++trades_;
                remaining -= fill_qty;
                it->remaining -= fill_qty;
                if (it->remaining == 0) {
                    by_id_.erase(it->id);
                    fifo.erase(it);
                }
            }
            if (fifo.empty()) opposite.erase(level);
        }
    }
    void rest(Event const& e, Qty remaining) {
        if (!remaining) return;
        if (e.side == Side::Buy) {
            auto& fifo = bids_[e.price];
            fifo.push_back({e.id, remaining});
            by_id_.emplace(e.id, Location{e.side, e.price, std::prev(fifo.end())});
        } else {
            auto& fifo = asks_[e.price];
            fifo.push_back({e.id, remaining});
            by_id_.emplace(e.id, Location{e.side, e.price, std::prev(fifo.end())});
        }
    }
    bool cancel(Id id) {
        auto loc = by_id_.find(id);
        if (loc == by_id_.end()) return false;
        const auto info = loc->second;
        if (info.side == Side::Buy) {
            auto it = bids_.find(info.price);
            it->second.erase(info.node);
            if (it->second.empty()) bids_.erase(it);
        } else {
            auto it = asks_.find(info.price);
            it->second.erase(info.node);
            if (it->second.empty()) asks_.erase(it);
        }
        by_id_.erase(loc);
        return true;
    }
public:
    // Reject sequence gaps without consuming the missing number. A structurally valid
    // sequenced message consumes its number EVEN if its business rule rejects it.
    Outcome process(Event const& e) {
        if (seq_ == UINT64_MAX || e.seq != seq_ + 1) return {false, "SEQ_GAP", {}};
        seq_ = e.seq;
        if (e.id == 0) return {false, "INVALID_ID", {}};
        if (e.kind == Kind::Cancel) {
            if (!cancel(e.id)) return {false, "UNKNOWN_ORDER", {}};
            return {true, "CANCELLED", {}};
        }
        if (e.quantity == 0 || e.quantity > max_order_qty) return {false, "INVALID_QUANTITY", {}};
        if (e.kind == Kind::Limit && (e.price <= 0 || e.price > max_price))
            return {false, "INVALID_PRICE", {}};
        if (e.kind == Kind::Limit && by_id_.contains(e.id))
            return {false, "DUPLICATE_ACTIVE_ID", {}};
        Qty left = e.quantity;
        Outcome out{true, "ACCEPTED", {}};
        if (e.side == Side::Buy) match(asks_, e, left, out);
        else match(bids_, e, left, out);
        if (e.kind == Kind::Limit && left > 0) rest(e, left);
        // Market orders are immediate-or-cancel; unfilled quantity is discarded.
        return out;
    }
    std::uint64_t sequence() const { return seq_; }
    std::size_t resting_count() const { return by_id_.size(); }
    std::uint64_t trades_count() const { return trades_; }
    std::optional<Quote> best_bid() const { return bids_.empty() ? std::nullopt :
        std::optional<Quote>(Quote{bids_.begin()->first, total(bids_.begin()->second)}); }
    std::optional<Quote> best_ask() const { return asks_.empty() ? std::nullopt :
        std::optional<Quote>(Quote{asks_.begin()->first, total(asks_.begin()->second)}); }
    static std::uint64_t total(Level const& q) {
        std::uint64_t sum = 0;
        for (const auto& r : q) sum += r.remaining;
        return sum;
    }
    // Stable, platform-independent canonical representation. Avoid reliance on unordered_map iteration.
    std::string canonical() const {
        std::ostringstream s;
        s << "seq=" << seq_ << ";trades=" << trades_ << ";";
        for (const auto& [price, fifo] : bids_) {
            s << 'B' << price << ':';
            for (auto const& order : fifo) s << order.id << '=' << order.remaining << ',';
            s << ';';
        }
        for (const auto& [price, fifo] : asks_) {
            s << 'A' << price << ':';
            for (auto const& order : fifo) s << order.id << '=' << order.remaining << ',';
            s << ';';
        }
        return s.str();
    }
    std::uint64_t state_hash() const {
        std::uint64_t h = 14695981039346656037ULL;
        for (unsigned char c : canonical()) { h ^= c; h *= 1099511628211ULL; }
        return h; // FNV-1a: regression checksum only, NOT cryptographic security.
    }
    bool invariant() const {
        std::size_t count=0;
        for (auto const& [p, fifo] : bids_) {
            if (p<=0||fifo.empty()) return false;
            for (auto it=fifo.begin(); it!=fifo.end(); ++it) {
                if (it->remaining==0) return false;
                auto loc=by_id_.find(it->id);
                if (loc==by_id_.end()||loc->second.side!=Side::Buy||loc->second.price!=p||loc->second.node!=it) return false;
                ++count;
            }
        }
        for (auto const& [p, fifo] : asks_) {
            if (p<=0||fifo.empty()) return false;
            for (auto it=fifo.begin(); it!=fifo.end(); ++it) {
                if (it->remaining==0) return false;
                auto loc=by_id_.find(it->id);
                if (loc==by_id_.end()||loc->second.side!=Side::Sell||loc->second.price!=p||loc->second.node!=it) return false;
                ++count;
            }
        }
        if (count!=by_id_.size()) return false;
        return bids_.empty()||asks_.empty()||bids_.begin()->first<asks_.begin()->first;
    }
};
} // namespace mastery::exchange