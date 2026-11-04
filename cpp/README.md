# Mastery · C++20 Programming Laboratories

These are **native, runnable C++ tests**, not simulated output. The `include/` folder intentionally contains incomplete student implementations. `reference/` contains fully working, separately tested versions. All functions, templates and tests are original courseware.

## Build and test on Linux / macOS / Windows (MSYS2 or MinGW with CMake)

You need a C++20-capable compiler, CMake >=3.18, and a terminal.

```bash
# Reference suite — should pass: this verifies the test harness and instructor solutions.
cmake -S cpp -B cpp/build -DCMAKE_BUILD_TYPE=Debug
cmake --build cpp/build --parallel
ctest --test-dir cpp/build --output-on-failure

# Student TODO suite — fails until you implement the functions in cpp/include.
cmake -S cpp -B cpp/student-build -DMASTERY_STUDENT=ON -DCMAKE_BUILD_TYPE=Debug
cmake --build cpp/student-build --parallel
ctest --test-dir cpp/student-build --output-on-failure

# Optional sanitizer build (GCC/Clang on Linux, supported non-Windows platforms).
cmake -S cpp -B cpp/asan-build -DMASTERY_STUDENT=ON -DMASTERY_SANITIZE=ON -DCMAKE_BUILD_TYPE=Debug
cmake --build cpp/asan-build --parallel
ctest --test-dir cpp/asan-build --output-on-failure

# Reference microbenchmarks; optimized Release build, no sanitizer.
cmake -S cpp -B cpp/release-build -DCMAKE_BUILD_TYPE=Release
cmake --build cpp/release-build --parallel
./cpp/release-build/mastery_benchmark
```

On Windows (PowerShell), the last command is normally `./cpp/release-build/Release/mastery_benchmark.exe` with a multi-config generator. For MSVC, some compiler warning flags may differ; use a GCC/Clang toolchain if needed.

## Assignments

1. **two_sum**: hash-map invariant, randomized oracle, integer overflow guard.
2. **SpscRing<T,N>**: full-N capacity; acquire/release publication; wraparound; 100,000 transfers across real threads. The API is explicitly single-producer, single-consumer.
3. **OrderBook**: price-time priority, quantity accounting, partial fills, cancel, rejection of invalid events, and deterministic replay. Inputs use integer ticks, not floating-point dollars.

Study each `tests/test_*.cpp` file before editing. The tests are part of the specification. Run them against your own headers, then consult `reference` for comparison.

## Benchmark integrity

`bench/bench.cpp` reports observed p50, p95, p99, and mean nanoseconds **on your own machine only**. This is a single-process microbenchmark (not a realistic exchange latency, clock calibrated trading benchmark, throughput SLA, thread contention test, or apples-to-apples comparative study). Environment, CPU power state, cache, compiler, sanitizer, allocation and workload matter. No claims about company systems or exchange performance follow from these numbers.

## Security and limitations

Do not compile unknown third-party source without reviewing it. The reference queue uses the simple SPSC ownership regime and does not implement general MPMC, safe memory reclamation or wait-free progress. The reference book prioritizes explicitness and determinism over optimal cancel complexity. Both are instructional baselines, not production trading systems.