# Mastery · deterministic market-systems engineering (C++20)

A deliberately small, independently authored reference exchange for studying **price–time priority**, order lifetimes, deterministic event replay, native benchmark methodology and operational failure handling. This is **not** production trading software and does not implement external venue protocols, account ownership, market halts or live order routing.

## Build and verify

```bash
cmake -S exchange -B exchange/build -DCMAKE_BUILD_TYPE=Release
cmake --build exchange/build --parallel 2
ctest --test-dir exchange/build --output-on-failure
./exchange/build/mastery_replay exchange/fixtures/session.csv --trace
./exchange/build/mastery_replay exchange/fixtures/session.csv
./exchange/build/mastery_exchange_bench > measurements.json
./exchange/build/mastery_allocator_experiment
```

For extra memory-safety checks (GCC/Clang, Unix):

```bash
cmake -S exchange -B exchange/build-san -DCMAKE_BUILD_TYPE=Debug -DMASTERY_ASAN=ON
cmake --build exchange/build-san --parallel 2
ctest --test-dir exchange/build-san -R exchange_invariants --output-on-failure
```

These commands do not require package dependencies beyond CMake and a C++20 compiler. The test source explicitly undefines `NDEBUG` before including `<cassert>` so its assertions stay active even in Release builds.

## Event contract (CSV)

Each input line is `seq,kind,id,side,price,quantity`.

- `seq` starts at 1 and increments by **exactly one**. A missing sequence halts replay without silently advancing; reconnecting requires retransmission or a fresh sequenced snapshot.
- `kind` is `limit`, `market` or `cancel`; `side` is `buy` or `sell`.
- A `limit` has positive integer tick price (≤ 10¹²) and quantity 1..1,000,000. A `market` order has quantity 1..1,000,000; its unfilled remainder is **discarded** (immediate-or-cancel).
- A `cancel` identifies an **active** resting order; its price and quantity fields are ignored. The reference does **not** model account authentication/authorization.
- Reused IDs are rejected only if an order with that ID is **currently** resting. Production engines typically need more comprehensive order-ID and replay/idempotency contracts.
- A semantically rejected event (e.g., unknown cancellation) still consumes its valid sequence number; a sequence gap does not.
- Fills execute at **maker price**, first best eligible price, then FIFO at that price. A partially filled resting order retains its original queue position.

### Golden fixture

The 12-message `exchange/fixtures/session.csv` terminates with four resting orders, best bid 100, best ask 102 and **FNV-1a 64-bit fingerprint `15719539211984847471`**. The replay CLI and the separate JavaScript educational model both produce the same canonical string:

```text
seq=12;trades=4;B100:7=4,;A102:8=2,;A104:2=7,;A105:10=4,;
```

The checksum is **not a cryptographic signature**; it is a deterministic regression fingerprint of this exact representation. Any change to serialization must explicitly update the reference snapshot and test it.

## Architecture and complexity

The reference uses `std::map<price, std::list<order>>` for ordered prices + FIFO queues, with an `std::unordered_map<id, location>` for cancel lookup. This preserves stable iterators for partially filled or unrelated orders, with ordinary node allocation. It is **not** a low-allocation exchange-grade design. Price level navigation is O(log L), ID lookup expected O(1) but can degrade, and each fill removes/updates the oldest queue member. `Exchange::invariant()` traverses the book and checks every locator (debug/test use only, not on a production hot path).

The matching result is deterministic for valid event tapes, but performance depends strongly on workloads and memory layout. The deliberate simplification is suitable for explaining correctness before advanced structures (fixed-capacity arenas, intrusive lists, slab indexing, generation counters, and bounded overflow paths).

## Benchmarks and experiment hygiene

`mastery_exchange_bench` emits a **native**, single-threaded synthetic JSON report with measured nanoseconds for `limit_add` and `cancel_indexed`. It uses a seeded shuffle, a warmup sequence, and 10,000 per-operation samples for each. Wall-clock instrumentation itself has overhead. Use it to learn experimental design; **never** report the numbers as production exchange p99 or compare runs from unrelated machines.

The benchmark can be uploaded to **Mastery → Market Systems → Native benchmark analysis**. No default latency numbers are shown. The `mastery_allocator_experiment` uses `std::pmr::monotonic_buffer_resource` for transient scratch storage and shows one measured comparison, not a general performance guarantee.

## Suggested university-style exercises

1. Prove by induction that the resting book never crosses after an accepted event.
2. Implement a bounded slab allocator and ID-to-handle generation counters, then prove stale handles are rejected.
3. Extend the replay format with a snapshot sequence, schema version, and event digest, then fuzz replay cut points.
4. Replace the order-ID lookup with a property-tested alternative and report repeatable memory/performance tradeoffs.
5. Specify durable ACK, account risk/versioning, gap recovery, and leader fencing **before** proposing real deployment.

## Reading guidance

Conceptual reading: Stroustrup, *A Tour of C++*; C++ Core Guidelines (open GitHub repository); cppreference on `std::map`, `std::list`, and `std::pmr`; Kleppmann, *Designing Data-Intensive Applications* (consult authorized copy); MIT 6.5840 public distributed-systems lecture materials; and publicly available limit-order-book research (including Avellaneda–Stoikov's educational model). Do not reproduce copyrighted texts without permission.