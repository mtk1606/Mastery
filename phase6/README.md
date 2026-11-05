# Mastery Phase VI — Durable Recovery, Idempotency and Subscriber Replay

**Independent Linux/POSIX reference implementation (C++20)**

The course page is `../phase6.html`. The C++ reference uses the existing Phase V multi-symbol `Venue`, but adds a single-writer, fsync-backed append-only journal, durable receipt reconstruction, a deliberately injected process termination, and a separately tested bounded subscriber history.

## Build and run

```bash
cmake -S phase6 -B phase6/build -DCMAKE_BUILD_TYPE=Debug
cmake --build phase6/build
ctest --test-dir phase6/build --output-on-failure
mkdir -p phase6/work
./phase6/build/durable_demo phase6/work/orders.wal
./phase6/build/durable_demo phase6/work/orders.wal
```

The first run logs and applies the command, then retries the same key; the second run reopens the WAL, rebuilds the receipt, and does **not** apply a second order. This is Linux-only and needs a writable local filesystem with POSIX `flock`, `fsync`, `pread` and `ftruncate` support.

Optional sanitizer verification:

```bash
cmake -S phase6 -B phase6/build-asan -DCMAKE_BUILD_TYPE=Debug -DMASTERY_SANITIZE=ON
cmake --build phase6/build-asan
ctest --test-dir phase6/build-asan --output-on-failure
```

## The precise durability contract

- One writer holds an exclusive *advisory* lock for the lifetime of the log handle. All collaborating processes must respect it. The journal is stored in a caller-created directory.
- The journal accepts canonical ASCII records with newline framing and a 64-bit noncryptographic FNV-1a checksum, and enforces strict sequence/epoch monotonicity.
- A new command is written and **fsynced before it mutates the authoritative in-memory `Venue` and before the code returns a successful receipt**. A crash injected after fsync but before apply demonstrates that replay reconstructs the event and its idempotency receipt.
- An incomplete final record lacking the newline terminator is truncated and the truncation fsynced. A complete record with an invalid checksum, malformed payload, duplicated idempotency key, sequence gap, or divergent state hash fails closed.
- A `(client, key)` is tied to the canonical order payload. Exact retry returns the earlier receipt without a second event; a reused key with a different payload returns `KEY_CONFLICT`. Business-rule rejections are also durable outcomes.
- `Venue` candidates are reconstructed from the existing checked checkpoint format, *not* naively copied. This matters because the `Exchange` contains list iterators in its order-ID index.
- Promotions are written to the same WAL and synced before modifying the live epoch. However, this still is **not leader election or consensus**.

## Subscribers and replay bounds

`RetainedFeed` holds at most C event summaries with contiguous sequence numbers. Readers have independent cursors. A publisher never blocks waiting for a subscriber. If subscriber cursor `d` precedes `oldest-1`, the reader receives `GAP_NEEDS_SNAPSHOT`; it must obtain a fresh authoritative snapshot at a known sequence before consuming further deltas. The in-memory feed's cursor state is not durably stored.

## Important non-guarantees

This is an **educational module, not a production storage engine or order gateway**. In particular:

- The tests model process termination and partial trailing records. They do not establish arbitrary **power-failure durability** on all disks, filesystems, controllers, virtualization stacks or network filesystems. Fsync return values and directory synchronization are checked, but real hardware tests are needed for power-cut claims.
- Journal record size is bounded and there is no compaction or WAL segment rollover. Key retention is indefinite within the bounded WAL; full logs refuse writes. No durable snapshot + log archival coordination is implemented.
- No malicious-client authentication, cryptographic message authentication, network transport, consensus leader election, multi-process lease fencing, or external exactly-once settlement is implemented.
- The simple newline framing and FNV checksum are for instruction; cryptographic protection is not claimed. The path handling is not hardened against a malicious local filesystem user.
- The browser visualization in `phase6-model.js` **does not execute learner C++ or model the OS page cache**. It is a separate pedagogical reference that teaches the relevant ordering and failure cuts.

## What the tests actually establish

The native test covers: initial commit, same-key retry, different-payload conflict, durable business rejection, reopen and receipt reconstruction, single-writer lock, forked process with deliberate crash after WAL fsync and before memory apply, incomplete trailing frame truncation, terminated record corruption rejection, epoch persistence, and 600 seeded client requests replayed after restart.

The independent reference checks five browser crash stories and 6,000 deterministic feed messages with fast/stalled subscribers. The Playwright course journey checks the actual served website, rendered lectures, both interactive labs, writing, export, timers, two themes and mobile layout. All tests run automatically under `.github/workflows/phase6-ci.yml`.

## Primary reading

- Linux [`fsync(2)`](https://man7.org/linux/man-pages/man2/fsync.2.html), [`open(2)`](https://man7.org/linux/man-pages/man2/open.2.html), [`flock(2)`](https://man7.org/linux/man-pages/man2/flock.2.html)
- SQLite [Atomic Commit in SQLite](https://www.sqlite.org/atomiccommit.html) — a deeper account of filesystem failure ordering (read as a reference, not a claim that Mastery uses SQLite).
- Martin Kleppmann, *Designing Data-Intensive Applications* (conceptual reference; not reproduced).