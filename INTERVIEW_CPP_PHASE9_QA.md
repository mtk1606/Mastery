# Mastery Phase IX — C++20 Interview Defense

## Purpose

Bridge the source-audited Phase VIII practice catalogue and the existing Clang/WASM compiler with six more independently evaluated C++20 interview implementations. Material is original. Each new term is defined in the lesson before it is used, and the explanation includes a loop invariant or state abstraction, a correctness argument, a counterexample, a worked trace and harder constraints.

## Six independently evaluated problem contracts

| Lab | Source-linked problem | New concept to master | C++ function/class |
|---|---|---|---|
| Bracket matching | LeetCode Valid Parentheses | LIFO, stack invariant | `bool isValid(const std::string&)` |
| Binary search | LeetCode Binary Search | Half-open ranges, variant function | `int searchIndex(const std::vector<int>&,int)` |
| Streaming maxima | LeetCode Sliding Window Maximum | Monotonic deque, amortized proof | `std::vector<int> maxSlidingWindow(...)` |
| Interval merging | LeetCode Merge Intervals | Sorting, greedy induction | `std::vector<std::vector<int>> mergeIntervals(...)` |
| Coin change | LeetCode Coin Change | DP states and recurrence | `int coinChange(const std::vector<int>&,int)` |
| LRU cache | LeetCode LRU Cache | Iterator stability, doubly linked list, hashmap | `class LRUCache` |

A further four foundation C++20 labs remain available at `cpp-lab.html`, making **10 distinct browser-based C++20 exercises in Mastery** (four earlier labs + these six).

## Verification

- Native `g++ -std=c++20` compilation succeeded for reference implementations on seeds 1, 2 and 11: **522/522 deterministic and seeded cases** across 18 C++ executables.
- Every deliberately incomplete starter also compiled, then failed its expected tests. This verifies the tests can detect unfinished answers; it does not prove they catch every possible wrong solution.
- Local Chromium interface check passed with a disposable mock compiler worker: selection, failing and passing responses, two seed batches, structured reasoning, instructor analysis, JSON export, Light/Dark switch, and mobile layout. This is a UI-only check, not a claim of real C++ compilation in that mock-worker test.
- GitHub CI workflow `.github/workflows/interview-cpp-ci.yml` separately runs the actual Clang 22/WebAssembly worker in Chromium and tests the same-origin manifest. **Its final result must be checked after deployment; do not infer success from native or mock-worker tests.**

## Honest assessment boundaries

- Automatic checks can confirm finite C++ input/output cases and three structured concept answers. **Unrestricted written explanations are not automatically judged or certified.**
- Student code and the test harness execute inside a browser Worker with a watchdog. It is a single-user educational tool, **not a hardened public code-execution sandbox**, and a learner can tamper with client-side test reporting. Public/generated test cases are **not secure hidden tests**.
- Compiler targets WASI; this neither measures x86 hardware latency nor permits normal native-thread performance experiments. Use the existing native C++ projects for those.
- LeetCode names link to the publisher's official problem pages. Their copyrighted statements are not embedded in Mastery. Any historical company tags remain explicitly third-party reports, not certified interview history.
- Two passing seed batches are practice evidence only. Full correctness, interview communication, calm under time pressure, and hiring readiness require independent validation, including human mock interviews.
- No lesson locks, paywalls, server accounts, or cross-device sync. Progress is locally stored and JSON-exportable.

## Next educational phase

An interviewer-agent-style dialogue could ask one unexpected constraint at a time, then evaluate executable code, structured proof obligations, and human-reviewed explanations separately. Higher-fidelity future execution requires robust server isolation and user consent, not an unguarded browser script.