#pragma once
#include <array>
#include <atomic>
#include <cstddef>

namespace mastery {
template <class T, size_t N> class SpscRing {
    static_assert(N >= 2, "ring capacity must be at least 2");
    static_assert(std::atomic<size_t>::is_always_lock_free, "This lab expects lock-free counters");
    std::array<T,N> items_{};
    std::atomic<size_t> read_{0}; // Consumer-owned counter
    std::atomic<size_t> write_{0}; // Producer-owned counter
public:
    bool push(const T& value) {
        const auto w = write_.load(std::memory_order_relaxed);
        if (w - read_.load(std::memory_order_acquire) == N) return false;
        items_[w % N] = value;
        write_.store(w + 1, std::memory_order_release);
        return true;
    }
    bool pop(T& out) {
        const auto r = read_.load(std::memory_order_relaxed);
        if (r == write_.load(std::memory_order_acquire)) return false;
        out = items_[r % N];
        read_.store(r + 1, std::memory_order_release);
        return true;
    }
};
} // namespace mastery