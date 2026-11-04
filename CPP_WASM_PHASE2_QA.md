# Mastery C++20 / WebAssembly Phase II — QA Report

**Date:** November 4, 2026
**Deployment:** https://mtk1606.github.io/Mastery/cpp-lab.html
**All in-browser C++ compiler smoke tests passed:** [GitHub Actions run 41930630176](https://github.com/mtk1606/Mastery/actions/runs/41930630176)
**GitHub Pages publish:** [GitHub Actions run 41930636129](https://github.com/mtk1606/Mastery/actions/runs/41930636129)

## Verified work

1. The Clang/LLVM 22.1.8 browser toolchain is **self-hosted from `clang/`** on the Mastery GitHub Pages origin. GitHub's asset vendor job completed successfully and committed `clang.wasm.gz` (~15.7 MB), `lld.wasm.gz` (~7.8 MB), `sysroot.tar.gz` (~5.4 MB), `memfs.wasm.gz`, and the runtime manifest. The browser smoke test checks the same-origin manifest and captures a Worker status proving the local assets were selected over the CDN fallback.
2. The Web Worker executes **actual C++20** using `@live-codes/clang-wasm@0.3.0` and the wasm32-WASI target; no C++-to-JavaScript translation is used.
3. **30/30 actual Chromium Clang/WASI test cases passed**, from compilation through execution and results parsing:
    - Hash map / Two Sum: 9 / 9
    - Linked-list reversal: 7 / 7 (pointer identity, including empty list)
    - Bounded circular queue: 6 / 6 (empty, full, wraparound, capacity zero)
    - Price-time priority order book: 8 / 8 (FIFO, crossing, partial fills, cancel)
4. Independently, the same four reference solutions passed **30/30 compiled native g++14 C++20 tests** and the same 30 tests in AddressSanitizer + UndefinedBehaviorSanitizer builds.
5. Headless Chromium local static/UI checks passed for lecture navigation, explanatory glossary, reference-state navigation, save and JSON export, theme selection, mobile width, and the correctly labelled reference benchmark. A mock-worker test verified the UI's compiler protocol and pass/fail rows.
6. The previous Mathematics, Quant, Engineering and JavaScript lab pages remain separate; navigation now links to this new C++ laboratory.

## Important scope limits

- The fixed reference diagrams **do not trace the student's arbitrary compiled C++**. They visualize worked reference events and pointer models only.
- The browser worker runs WASI, not host-native C++; real `std::thread` workloads, lock-free concurrency, kernel calls, CPU-cache performance counters, and production trading latency comparisons require native tooling.
- A **JavaScript** reference replay shows batch-average timing percentiles, not actual C++ per-event tail latencies. The existing `cpp/bench/bench.cpp` provides a native benchmark foundation.
- JavaScript and WebAssembly code execute within a browser Worker with a timeout and source-size limit. This is appropriate for personal educational exercises, **not a hardened untrusted multi-user remote execution service**.
- All tests are deterministic course exercises. Passing them does not constitute proof of full correctness or validation of realistic exchange matching semantics.
- The site's Light and Dark settings remain local preferences; saved drafts and notes are stored in the user's browser and can be exported/imported.
- The third-party compiler wrapper is vendor-pinned with the MIT license and notices. Compiler assets are copied from version 0.3.0 using a reproducible GitHub Actions workflow; a version-pinned CDN is the fallback if the local assets are absent.

## Next phase proposal

Create more advanced C++20 modules for allocators and `std::pmr`, iterator invalidation, cache-friendly order-book data structures, deterministic binary market-data replay, and native benchmarks with systematic variance control. Then introduce source-level diagnostics and actual debugger instrumentation rather than representing reference diagrams as user execution.
