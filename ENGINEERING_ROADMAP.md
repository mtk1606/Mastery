# Mastery Engineering Academy — phased delivery

## Phase 1 — Implemented (November 2026)
- DSA: 10 original lessons (hash tables, two pointers, sliding window, binary search, linked lists, monotone stacks, trees, BFS graphs, heaps/top-K, one-dimensional dynamic programming).
- 30 direct official LeetCode problem links (curated pedagogically, not a verified frequency ranking for any named firm).
- Six genuinely instructional code-state visualizers: move forwards/backwards through the input, pointer/index state, and code operation.
- Every DSA lesson: vocabulary/function reference, recognition trigger, invariant, proof, C++20 solution, exact complexity, worked trace, counterexample, and interview extensions.
- Finance C++: object lifetime/RAII, cache locality, atomics and an SPSC publication sketch, order-book matching and latency budgets. These are educational examples, not production order-book or lock-free library implementations.
- System design: requirements/capacity, replication/consistency, failure/backpressure.
- No lesson locks. Personal notes, completion markers, progress import/export in the browser.

## Phase 2 — Next: complete the interview DSA patterns
- Greedy and exchange arguments; intervals and sweep lines; prefix sums and difference arrays; tries; backtracking; tree reconstruction and lowest common ancestor; union-find; DAG topological sort; Dijkstra; minimum spanning tree; monotonic queues; binary-search-on-answer; 2-D dynamic programming and knapsack; bit manipulation; segment/Fenwick trees.
- Target a curated 75-question essentials pathway and a 150-question extended pathway, each tied to actual public problem links and role-specific difficulty notes.
- Add an in-browser safe code editor and compilation/test service if a robust backend/runtime is available; until then, explicitly distinguish written code from executed tests.
- Upgrade visualizers to display queues, heaps, call stacks, DP tables, and memory pointer lifetimes with variable input sequences.
- Add spaced retrieval and error review without blocking any lessons.

## Phase 3 — Market-systems C++ deep dive
- C++20 value categories, copy elision, allocators/pmr, move semantics, templates, concepts, object representation, volatile vs atomic, UB, cache coherence, vectorization, false sharing.
- Build and benchmark a deterministic exchange simulator: event feed, price/time matching, integer ticks, cancellations, replay, state hash, correctness tests, benchmark distributions.
- Concurrency: SPSC/MPMC ownership regimes, memory ordering, ABA, reclamation strategies, bounded backpressure.
- Evaluate reproducibility and p50/p95/p99 latency; distinguish baseline and optimized variants.

## Phase 4 — Distributed & low-latency system design
- Deep cases: rate limiter, news feed, notification service, distributed KV store, event streaming, time-series store, exchange gateway, market data fanout, risk checks, order management.
- Capacity worksheets, consistency contracts, API definitions, failure injection, cost/performance tradeoffs, diagram walkthroughs, and mock interview rubrics.

## Phase 5 — Interview simulation and calibration
- Timed rounds with hidden pattern cues, multiple-solution evaluation, follow-up constraints, test design, complexity proof scoring, and structured written feedback.
- Distinct tracks for SWE graduate, quant developer, low-latency infrastructure, and research engineer.
- Use clearly sourced public information; do not imply proprietary access to employer interview banks.

## References
- Cormen et al., *Introduction to Algorithms*
- Skiena, *The Algorithm Design Manual*
- Sedgewick & Wayne, *Algorithms*
- Stroustrup, *A Tour of C++*
- Williams, *C++ Concurrency in Action*
- Kleppmann, *Designing Data-Intensive Applications*
- cppreference — https://en.cppreference.com/w/
- NeetCode — https://neetcode.io/roadmap
- LeetCode — https://leetcode.com/studyplan/top-interview-150/
- System Design Primer — https://github.com/donnemartin/system-design-primer

The project is independent educational work; it is not associated with, certified by, or an official interview curriculum of any hiring company or university.
