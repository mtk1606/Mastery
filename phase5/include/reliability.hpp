#pragma once
// Mastery Phase V: deterministic multi-symbol routing, logical snapshot + delta
// recovery, fencing and bounded all-or-nothing fanout. Educational, not a venue.
#include "../../exchange/include/exchange.hpp"
#include <cstdint>
#include <deque>
#include <iomanip>
#include <limits>
#include <map>
#include <set>
#include <sstream>
#include <stdexcept>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace mastery::phase5 {
using namespace mastery::exchange;
inline std::uint64_t fingerprint(std::string_view data) {
    std::uint64_t h = 14695981039346656037ULL;
    for (unsigned char c : data) { h ^= c; h *= 1099511628211ULL; }
    return h;  // Noncryptographic checksum, NOT tamper resistance.
}
inline bool symbol_valid(const std::string& s) {
    if (s.empty() || s.size() > 12 || s.front() < 'A' || s.front() > 'Z') return false;
    for (unsigned char c : s) if (!(c >= 'A' && c <= 'Z') && !(c >= '0' && c <= '9') && c != '_') return false;
    return true;
}
struct Input {
    std::uint64_t epoch{};
    std::uint64_t seq{};  // Global monotonically increasing feed sequence.
    std::string symbol;
    Kind kind{};
    Id id{};
    Side side{};
    Price price{};
    Qty quantity{};
};
struct Reply {
    bool accepted{};
    std::string reason;
    std::vector<Fill> fills;
    bool operator==(Reply const&) const = default;
};
class Venue {
    std::uint64_t epoch_{1}, seq_{};
    std::map<std::string, Exchange> books_;
public:
    explicit Venue(std::vector<std::string> symbols, std::uint64_t epoch = 1) : epoch_(epoch) {
        if (epoch == 0 || symbols.empty() || symbols.size() > 64) throw std::invalid_argument("invalid epoch or symbol count");
        for (auto const& sym : symbols) {
            if (!symbol_valid(sym) || !books_.emplace(sym, Exchange{}).second)
                throw std::invalid_argument("invalid or duplicate symbol");
        }
    }
    std::uint64_t epoch() const { return epoch_; }
    std::uint64_t sequence() const { return seq_; }
    const auto& books() const { return books_; }
    const Exchange& book(const std::string& sym) const { return books_.at(sym); }
    bool promote(std::uint64_t new_epoch) {
        if (new_epoch <= epoch_) return false; // Old leader is fenced out.
        epoch_ = new_epoch;
        return true;
    }
    Reply apply(Input const& e) {
        if (e.epoch < epoch_) return {false, "FENCED_EPOCH", {}};
        if (e.epoch > epoch_) return {false, "UNKNOWN_EPOCH", {}}; // promote explicitly
        if (seq_ == UINT64_MAX || e.seq != seq_ + 1) return {false, "SEQ_GAP_OR_REPLAY", {}};
        // A well-sequenced business rejection still consumes the GLOBAL sequence.
        seq_ = e.seq;
        auto book = books_.find(e.symbol);
        if (book == books_.end()) return {false, "UNKNOWN_SYMBOL", {}};
        if (book->second.sequence() == UINT64_MAX) throw std::overflow_error("local book sequence exhausted");
        Event local{book->second.sequence()+1, e.kind, e.id, e.side, e.price, e.quantity};
        auto out = book->second.process(local);
        if (!book->second.invariant()) throw std::logic_error("book invariant violated");
        return {out.accepted, out.reason, std::move(out.fills)};
    }
    std::string canonical() const {
        std::ostringstream s;
        s << "epoch=" << epoch_ << ";global=" << seq_ << ';';
        for (auto const& [sym, book] : books_) s << sym << '{' << book.canonical() << "};";
        return s.str();
    }
    std::uint64_t state_hash() const { return fingerprint(canonical()); }
    bool invariant() const {
        std::uint64_t total_local = 0;
        for (auto const& [sym, book] : books_) {
            if (!book.invariant() || book.sequence() > seq_) return false;
            if (total_local > seq_ - book.sequence()) return false;
            total_local += book.sequence();
        }
        return total_local <= seq_;
    }
    // Logical checkpoint. The caller must atomically persist this file and the
    // append-only deltas; std::ofstream alone does not confer crash durability.
    std::string checkpoint() const {
        std::ostringstream body;
        body << "MASTERY_CHECKPOINT 1\n" << epoch_ << ' ' << seq_ << ' ' << books_.size() << '\n';
        for (auto const& [sym, book] : books_) {
            const auto s = book.export_snapshot();
            body << std::quoted(sym) << ' ' << s.sequence << ' ' << s.trades << ' ' << s.orders.size() << '\n';
            for (auto const& o : s.orders)
                body << o.id << ' ' << (o.side == Side::Buy ? 'B' : 'S') << ' ' << o.price << ' ' << o.remaining << '\n';
        }
        const auto data = body.str();
        return data + "CHECK " + std::to_string(fingerprint(data)) + "\n";
    }
    void restore(std::string const& encoded) {
        if (encoded.size() > 2'000'000) throw std::invalid_argument("checkpoint too large");
        const auto p = encoded.rfind("CHECK ");
        if (p == std::string::npos || (p && encoded[p-1] != '\n')) throw std::invalid_argument("missing checkpoint checksum");
        const auto payload = encoded.substr(0,p);
        std::istringstream tail(encoded.substr(p));
        std::string check, stray;
        std::uint64_t received{};
        if (!(tail >> check >> received) || check != "CHECK" || (tail >> stray) || received != fingerprint(payload))
            throw std::invalid_argument("corrupt checkpoint checksum");
        std::istringstream input(payload);
        std::string magic;
        int version{};
        std::uint64_t incoming_epoch{}, incoming_seq{};
        std::size_t count{};
        if (!(input >> magic >> version >> incoming_epoch >> incoming_seq >> count) ||
            magic != "MASTERY_CHECKPOINT" || version != 1 || incoming_epoch == 0 || count != books_.size())
            throw std::invalid_argument("invalid checkpoint header");
        std::vector<std::string> names;
        for (auto const& [sym,_] : books_) names.push_back(sym);
        Venue candidate(names, incoming_epoch);
        candidate.seq_ = incoming_seq;
        std::size_t total_orders = 0;
        for (std::size_t i=0; i<count; ++i) {
            std::string sym;
            Exchange::Snapshot snap;
            std::size_t n{};
            if (!(input >> std::quoted(sym) >> snap.sequence >> snap.trades >> n) ||
                sym != names[i] || snap.sequence > incoming_seq || n > 100000 || total_orders + n > 100000)
                throw std::invalid_argument("invalid symbol snapshot header");
            total_orders += n;
            for (std::size_t j=0; j<n; ++j) {
                Id id{}; char side{}; Price px{}; Qty qty{};
                if (!(input >> id >> side >> px >> qty) || (side != 'B' && side != 'S'))
                    throw std::invalid_argument("invalid snapshot resting order");
                snap.orders.push_back({id, side == 'B' ? Side::Buy : Side::Sell, px, qty});
            }
            candidate.books_.at(sym).import_snapshot(snap);
        }
        if (input >> stray || !candidate.invariant()) throw std::invalid_argument("invalid checkpoint content");
        // All validation has passed: commit by swapping complete state.
        books_.swap(candidate.books_);
        std::swap(epoch_, candidate.epoch_);
        std::swap(seq_, candidate.seq_);
    }
};
struct Envelope {std::uint64_t seq; std::string symbol; std::string summary;};
// One slow client blocks the publisher, deliberately: explicit all-or-nothing
// backpressure is a teaching choice, NOT a scalable exchange fanout design.
class BoundedFanout {
    struct Subscriber {
        std::size_t capacity;
        std::uint64_t last_delivered;
        std::deque<Envelope> pending;
    };
    std::map<std::string,Subscriber> subscribers_;
    std::uint64_t last_published_{};
public:
    explicit BoundedFanout(std::uint64_t initial_seq = 0) : last_published_(initial_seq) {}
    bool subscribe(std::string const& client, std::size_t capacity, std::uint64_t snapshot_seq) {
        if (client.empty() || client.size()>32 || capacity==0 || capacity>1024 || snapshot_seq!=last_published_)
            return false; // Caller must obtain a current snapshot first.
        return subscribers_.emplace(client, Subscriber{capacity,snapshot_seq,{}}).second;
    }
    std::string publish(Envelope const& e) {
        if (last_published_ == UINT64_MAX || e.seq != last_published_+1) return "SEQ_GAP_OR_REPLAY";
        for (auto const& [client,subscriber] : subscribers_)
            if (subscriber.pending.size() >= subscriber.capacity) return "BACKPRESSURE";
        for (auto& [client,subscriber] : subscribers_) subscriber.pending.push_back(e);
        ++last_published_;
        return "ACCEPTED";
    }
    bool drain(std::string const& client, Envelope& out) {
        auto it=subscribers_.find(client);
        if (it==subscribers_.end() || it->second.pending.empty()) return false;
        auto& s=it->second;
        if (s.pending.front().seq != s.last_delivered+1) throw std::logic_error("subscriber gap");
        out=s.pending.front(); s.pending.pop_front(); s.last_delivered=out.seq;
        return true;
    }
    std::size_t depth(std::string const& client) const {return subscribers_.at(client).pending.size();}
    std::uint64_t delivered(std::string const& client) const {return subscribers_.at(client).last_delivered;}
    std::uint64_t last_published() const {return last_published_;}
};
}  // namespace mastery::phase5