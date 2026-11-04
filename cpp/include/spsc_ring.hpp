#pragma once
#include <array>
#include <atomic>
#include <cstddef>

namespace mastery {
// TASK: Implement a bounded single-producer/single-consumer queue.
// The queue must support all N slots and preserve FIFO under concurrency.
template <class T, size_t N> class SpscRing {
    static_assert(N >= 2, "ring capacity must be at least 2");
    std::array<T,N> items_{};
    std::atomic<size_t> read_{0}, write_{0};
public:
    bool push(const T& value) {
        (void)value;
        // TODO: check free space, write to slot, release-store write counter.
        return false;
    }
    bool pop(T& out) {
        (void)out;
        // TODO: acquire-load write counter, read slot, release-store read counter.
        return false;
    }
};
} // namespace mastery