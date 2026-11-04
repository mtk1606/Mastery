# Mastery C++20 / Market Systems Laboratory — Phase II

This release adds **real browser-side C++20 compilation** to the [Mastery](https://mtk1606.github.io/Mastery/) independent course site at [`cpp-lab.html`](https://mtk1606.github.io/Mastery/cpp-lab.html).

## What works

- Four carefully taught C++20 problems: two-sum/hash invariants; reversal of a singly linked list with pointer identity; a bounded FIFO ring queue with wraparound; and a simplified price-time priority order book with partial fills and cancel.
- **30 C++20 assertions** run from the same generated source harness in the browser (Clang 22/WASI) and natively (g++ 14). Every supplied reference passed native checks.
- Code is edited and saved in-browser, compiled in a disposable **Web Worker**, and returned as real compiler diagnostics and test rows. There is an explicit Stop button, a wall-clock watchdog, and a maximum source size. Not a JavaScript translation or a fake code runner.
- Four fixed, deterministic **reference-model** visualizations. They explain pointer rewiring, hash lookup, ring wraparound, and the order-book event sequence. They are **not** instrumentation of arbitrary learner C++ code.
- A separate measured **JavaScript** reference replay shows p50/p95/p99 of *batch-average* event times, labelled **not** native C++ benchmarks or per-event latencies.
- Code and notes can be downloaded, exported, and restored from JSON. Both existing Light/Dark themes work.
- The pre-existing `cpp/` native projects and native benchmarks remain the correct place to test real atomics, concurrency, sanitizers, and hardware timing.

## Browser C++ compiler and dependencies

- [@live-codes/clang-wasm](https://github.com/live-codes/clang-wasm), **0.3.0**. Its MIT-licensed ~303 KB IIFE compiler wrapper is stored under `vendor/clang-wasm.global.js`, with upstream licence and third-party notices.
- Browser runtime assets are **now hosted under Mastery's own `clang/` directory** (29 MB compressed), installed by a GitHub Actions vendor job. When that local manifest is unavailable, the runner falls back to the pinned npm CDN folder: `https://cdn.jsdelivr.net/npm/@live-codes/clang-wasm@0.3.0/assets/`. The local assets were published in GitHub under `clang/`, and the runner selects them first. CDN access is a deliberate fallback. First-time initialization downloads approximately 29 MB compressed into the browser; later runs reuse the initialized worker.
- For a fully self-hosted build, run `npx --package @live-codes/clang-wasm@0.3.0 clang-wasm-copy-assets ./clang`, make that `/clang/` folder accessible on the same origin, then change `TOOLCHAIN_ASSETS` in `cpp-wasm-worker.js` to `new URL('./clang/', self.location.href).href`. The package produces `asset-receipts.json` for reproducibility. Automating deployment of those assets is the next infrastructure step.
- The browser uses a WASI `wasm32` target. It cannot emulate native C++ threading or realistically measure native exchange latency, PMU counters, or sanitizer findings. Use Linux native Debug/Release/ASan/UBSan project testing for those.

## Test locally

```bash
python3 -m http.server 8765
# Open http://localhost:8765/cpp-lab.html in Chrome or Edge
node tests/native-smoke.cjs   # requires g++ with C++20
```

GitHub Actions runs native reference validation automatically and separately performs an **actual Chromium compiler smoke test** that compiles/executes the two-sum reference through Clang/WASI. The full 30-case Chromium smoke now verifies that the local Clang 22.1.8 assets are selected, not the CDN fallback.

## Security and scope

Code runs in a disposable browser Worker with controlled timeouts; the C++ WASI program has no browser DOM or network APIs exposed by the application. The Worker itself has its usual browser-origin permissions, so this design is intended for personal educational code, **not a hardened hostile multi-tenant judging service**. Avoid loading secrets or privileged accounts on the same origin. A future production judge should use stronger isolation, per-run quotas, integrity-verified asset hosting, and server-enforced execution policies.

No university or trading firm is affiliated with or endorses this educational project.