/* Original academic course content. This is not an official course of any university or trading firm. */
'use strict';
const MARKET_LECTURES=[
{
 id:'matching',chapter:'01',title:'Build a price–time matching engine',unit:'III · Exchange simulator',minutes:48,
 objective:'Derive the matching invariant and prove that orders execute at the best available price, then FIFO within that price.',
 intro:'An order book is a collection of price levels. Each level contains a queue of resting orders. A marketable incoming order consumes the opposing side, beginning with the best eligible price. A limit order can both trade and leave a remainder. Every trade executes at the resting maker’s price in this simplified model.',
 definitions:[
 ['Limit order','An instruction to trade no worse than a specified price; any unfilled remainder can rest in the book.'],
 ['Market order','An instruction to take available opposing liquidity immediately; in this model it is immediate-or-cancel.'],
 ['Price–time priority','Better price wins first. At equal price, earlier resting order wins.'],
 ['Maker / taker','The maker is already resting; the taker initiates the match. Maker’s price determines the trade in this model.'],
 ['Integer tick','An integer multiple of the minimum price increment. Avoid binary floating-point equality for matching.'],
 ['std::map','Ordered associative container. Its begin() exposes the best price with the appropriate ascending/descending comparator.'],
 ['std::list::iterator','Stable pointer-like position in a doubly linked list. Inserts elsewhere do not invalidate it; erasing its node does.'],
 ['std::unordered_map::find','Expected-constant-time lookup for the active order locator; worst-case complexity is not guaranteed O(1).']
 ],
 theorem:'After each accepted event, the resting book is uncrossed: either one side is empty, or best_bid < best_ask. Every fill has executed at the best eligible maker level, in arrival order at that level.',
 proof:[
 'Base case: the empty book is uncrossed and contains no priority violations.',
 'When a taker is marketable, inspect the opposing best price. Consume its FIFO queue from the front; if a maker is partially filled, keep it at that same queue position.',
 'When a price level is depleted, remove it and continue to the next-best level. Therefore no worse maker is matched before a better one.',
 'A nonmarketable remainder rests at its limit price. Because all crossing prices were exhausted, that remainder cannot cross the opposite best price.',
 'Cancellation removes exactly one live order through its locator. It does not change the relative order of any other resting orders.'
 ],
 example:'A sell book has order 11: 7 lots at 101, order 12: 4 lots at 101, and order 13: 5 lots at 102. A buy market order for 9 lots fills 7 from order 11 and 2 from order 12, both at 101. Order 12 retains its position with 2 lots; order 13 remains untouched.',
 pitfalls:['Using floating point for price comparisons.','Treating a partial fill as a new order and losing FIFO priority.','Erasing an order without deleting its ID locator.','Conflating a trade count with traded share volume.'],
 problem:'Prove that a sell limit at 100 cannot remain resting while the best bid is 101 after processing that order. Then implement cancellation with O(log L) level lookup and stable list iterators. What changes if cancellations are restricted to instrument and account ownership?',
 solution:'The incoming sell is marketable against all bids at or above 100; it must exhaust those bids or itself before any remainder can rest. The map/list implementation stores ID → (side, price, list iterator), erases that node and then deletes its empty price level. A production exchange also checks account authorization and durable audit records.',
 references:['exchange/include/exchange.hpp','exchange/tests/test_exchange.cpp']
},
{
 id:'replay',chapter:'02',title:'Make every state reproducible',unit:'III · Sequenced event replay',minutes:37,
 objective:'Explain why deterministic state transitions and explicit sequence-gap policy are prerequisites to safe market-data replay and incident reconstruction.',
 intro:'An event log defines both what happened and the order in which it happened. A well-defined replay engine applies the same event sequence to the same initial state and reaches the same result. This is not guaranteed if processing depends on wall-clock time, unordered container iteration, randomized IDs, or unrecorded external decisions.',
 definitions:[
 ['Sequence number','Monotone identifier assigned to events in one ordered stream. Here the expected next number is exactly previous+1.'],
 ['Event sourcing','Deriving current state from a recorded sequence of validated state-changing messages.'],
 ['Canonical serialization','A byte representation with fixed field order, side order, price order, and FIFO order.'],
 ['FNV-1a','A deterministic noncryptographic hash useful as a regression checksum; it does not authenticate messages.'],
 ['Idempotency key','Application-defined identifier used to deduplicate a retried request; distinct from replay sequence numbers.'],
 ['Snapshot','A recorded full state at one known sequence, allowing faster recovery when paired with subsequent events.']
 ],
 theorem:'For a deterministic transition function T and known initial state S₀, the state after n messages is uniquely determined by Sₙ=T(T(…T(S₀,e₁),e₂)…eₙ).',
 proof:[
 'The initial state is fixed. By assumption T is a function: one input state and one event produce one output state.',
 'By induction, if Sₖ is uniquely determined by events 1..k, then Sₖ₊₁=T(Sₖ,eₖ₊₁) is also uniquely determined.',
 'The result fails if a necessary input (such as price tick rules, event arrival priority, or hidden risk limit changes) is omitted from the log.',
 'Canonical serialization removes incidental iteration-order choices before computing a regression fingerprint.'
 ],
 example:'The supplied 12-event feed ends with four active orders, best bid 100, best ask 102, and FNV-1a 64-bit checksum 15719539211984847471. Replaying it from empty state produces the same canonical bytes on both the C++ and JavaScript educational references.',
 pitfalls:['Treating a checksum as a digital signature.','Silently skipping a missing feed sequence number.','Assuming “exactly once” transport delivery without explicit deduplication and recovery rules.','Publishing a snapshot without the sequence number to which it applies.'],
 problem:'A gateway receives event 500, then 502. Identify at least three distinct correct recovery choices depending on transport semantics. Explain why applying 502 immediately can corrupt a local order book even if every message is valid.',
 solution:'Options include buffering 502 and retransmitting 501, discarding live incremental state and requesting a fresh sequenced snapshot, or halting trading until data quality is restored. Applying 502 alone creates a state that may depend on an unknown cancellation, execution, or insertion in 501. Choice depends on feed contract, retention windows, and operational policy.',
 references:['exchange/fixtures/session.csv','exchange/src/replay.cpp','exchange/tests/test_exchange.cpp']
},
{
 id:'allocator',chapter:'03',title:'Memory ownership, layout and allocation',unit:'III · Modern C++ systems',minutes:44,
 objective:'Separate correctness constraints (object lifetime and iterator validity) from performance hypotheses (allocation and locality).',
 intro:'Low latency begins with correct lifetimes. An allocator changes where objects live, not the semantics of the objects. The order book uses a map of prices, FIFO linked lists, and a hash-based ID locator. This yields convenient stable iterators but performs pointer-chasing and allocation, so locality is an explicit engineering tradeoff.',
 definitions:[
 ['RAII','Resource Acquisition Is Initialization: bind resource acquisition and release to object lifetime.'],
 ['std::pmr','Polymorphic Memory Resources: container allocations are routed through a memory_resource selected at runtime.'],
 ['monotonic_buffer_resource','Bump allocator that reclaims memory on release/destruction, not on each individual deallocation.'],
 ['Iterator invalidation','When modification destroys or changes a reference/iterator’s guarantee of referring to the same element.'],
 ['Cache locality','Spatial/temporal reuse of adjacent or recently accessed memory locations.'],
 ['False sharing','Independent writes to distinct variables on the same cache line causing coherence traffic across cores.'],
 ['std::vector::reserve','Preallocate capacity without constructing elements; often reduces reallocations for a known workload.']
 ],
 theorem:'A memory resource must outlive every container that allocates through it. A list iterator remains valid while its node remains live, but erasing the node invalidates that specific iterator.',
 proof:[
 'The polymorphic allocator stores a pointer to its memory resource. Containers can request or release storage through that pointer during their lifetime.',
 'If the resource has already been destroyed, later container operations cannot safely use its allocator. Therefore the resource lifetime must enclose the container lifetime.',
 'A linked-list insertion changes adjacent links but does not relocate pre-existing nodes. Erasing a node ends that node’s lifetime and invalidates pointers/iterators to it.',
 'The engine removes its id→iterator locator before the erased node is accessed again.'
 ],
 example:'For transient scratch vectors, compare default std::vector allocation with a per-batch std::pmr::monotonic_buffer_resource backed by a local arena. This is a controlled allocator experiment; one result does not establish that pmr improves all programs or a live exchange.',
 pitfalls:['Using a memory resource after its backing buffer dies.','Reusing a monotonic arena while any container still points into it.','Assuming linked lists are always faster because insertion is O(1).','Reporting a microbenchmark speedup without documenting CPU, compiler options, warmup, and variance.'],
 problem:'Design a lower-allocation order book using stable slab indices or intrusive lists. Give the data layout, free-list policy, cancellation lookup, lifetime rules, and one scenario where your optimization could make tail latency worse.',
 solution:'Use a bounded slab of order nodes addressed by stable index+generation, an ID→handle map, and per-price FIFO head/tail indices. A generation counter prevents stale-handle reuse. Tail latency may worsen when a rare slab growth, compaction, cache miss, or overflow path occurs. Prove memory safety and benchmark real workloads before claiming improvement.',
 references:['exchange/src/allocator_experiment.cpp','exchange/include/exchange.hpp']
},
{
 id:'latency',chapter:'04',title:'Measure performance without fooling yourself',unit:'III · Performance methods',minutes:41,
 objective:'Design reproducible p50/p95/p99 measurements and explain why a single attractive number is not evidence of production performance.',
 intro:'An exchange system’s throughput and latency are distinct. A microbenchmark measures a particular function under chosen inputs and machine conditions. To make a meaningful claim, define the full operation, input distribution, warmup period, error-handling policy, units, and environment. Treat unusually good results with suspicion.',
 definitions:[
 ['p50 / p95 / p99','Observed sample percentiles. For p99, approximately 99% of recorded timings are at or below that percentile.'],
 ['steady_clock','Monotonic clock suitable for elapsed-duration timing; resolution and scheduling still affect observations.'],
 ['Tail latency','The slower portion of the latency distribution, often affected by allocation, scheduling, contention or page faults.'],
 ['Warmup','Operations run before measurement to reduce first-use effects, although warmup cannot eliminate all confounders.'],
 ['Throughput','Completed operations per unit time; high throughput does not imply low per-event latency.'],
 ['p-hacking','Choosing favourable runs, filters or percentiles after observing results without disclosure.'],
 ['Benchmark checksum','Observable work that discourages an optimizing compiler from removing the computation being timed.']
 ],
 theorem:'Sample percentile estimates depend on the input distribution and measurement protocol. Therefore two benchmarks with different workloads cannot be compared solely by their p99 figures.',
 proof:[
 'Each timing is drawn from the combined behaviour of code, inputs, hardware, runtime, and measurement apparatus.',
 'Changing the mix of cancels, adds, fills, and empty-book market orders changes the distribution being measured.',
 'Percentiles summarize a finite sample, not a universal property of an algorithm. Scheduling pauses and system load can dominate the tail.',
 'Controlled paired experiments, multiple independent runs, pinned configurations and distribution reporting reduce—but cannot eliminate—measurement error.'
 ],
 example:'The native program reports separately measured limit-add and indexed-cancel durations, in nanoseconds, from a seeded synthetic workload. Upload its JSON report into this page; Mastery will display only observed numbers, never fabricated latency charts.',
 pitfalls:['Claiming submicrosecond exchange latency from a browser timing test.','Benchmarking a no-op because all real work was optimized out.','Comparing two variants with different numbers of resting orders.','Using JavaScript batch averages as C++ per-event p99 values.'],
 problem:'Write an experiment plan comparing map+list cancellation against an indexed slab. Specify workload distribution, number of independent runs, how to handle 0-latency clock readings, how to normalize, and how you would decide that an observed difference is practically significant.',
 solution:'Generate deterministic event tapes with a recorded seed and controlled book occupancy; run multiple identical tapes on the same machine with same compiler flags and CPU policy. Report sample sizes, p50/p95/p99, minimum, outliers and throughput for every run. Treat 0ns measurements as timer granularity evidence. Compare observed distributions with confidence intervals or bootstrap resampling; do not claim a universal speedup from one run.',
 references:['exchange/src/bench.cpp','exchange/src/allocator_experiment.cpp']
}
];
const DESIGN_CASES=[
{
 id:'gateway',number:'A',title:'An order gateway under stress',minutes:55,
 task:'Design an inbound order gateway that accepts new orders, cancels and replaces; enforces hard risk limits; preserves idempotency under client retries; forwards accepted events to a matching partition; and produces an audit record for each decision. Make failure behavior explicit.',
 constraints:['Single symbol partition owns a sequenced matching engine.','Client may retry the same request after a timeout.','Risk limits may change intraday and must be auditable.','Network links can fail between accepting a request and confirming it.'],
 steps:['Specify APIs and identity/idempotency semantics.','State order and cancel authorization checks.','Choose a durability boundary and ACK contract.','Draw failure paths: timeout before ACK, risk-service outage, matching-partition outage.','Estimate steady and burst capacity, then define measurable SLOs.'],
 hints:['Do not equate a client TCP ACK with exchange acceptance.','A deduplication record and outcome must survive the same failure boundary if you promise replay-safe retries.'],
 model:'One owner per instrument assigns sequence numbers. At ingress, authenticate and authorize the account, check a stable client_request_id, validate integer ticks/quantity and durable risk configuration. Write the decision and routed event to an append-only journal before returning an accepted ACK if that is the stated durability contract. On retry, read the dedupe ledger and return the prior outcome. During a matching outage, stop accepting new orders or queue with strict bounded admission and an explicit pending status; never silently claim an order traded. Risk checks must be consistent with the latest signed risk version; if version is unavailable fail closed for new risk-increasing orders, while a policy may allow emergency cancels. Audit all rejects.',
 rubric:['Clear linearization/ACK point','Risk checks and authorization','Retry/idempotency semantics','Failure and recovery strategy','Capacity and observability']
},
{
 id:'fanout',number:'B',title:'Distribute a sequenced market-data feed',minutes:50,
 task:'Design a market-data service producing immutable sequenced updates to thousands of clients. Some clients are slow; others reconnect after losing an entire minute of updates. Explain how each client regains a consistent snapshot without mixing incompatible time windows.',
 constraints:['One partition produces a total event order per instrument.','Clients have different sustained bandwidth and occasional stalls.','A snapshot service periodically persists a book state and sequence.','The system should not let one slow client block the producer.'],
 steps:['Define snapshot + incremental protocol.','Choose a sequence-gap policy and recovery path.','Calculate peak egress for the chosen input assumptions.','Design bounded per-client buffers and slow-client policy.','Specify lag, gap, drop, resync and quality metrics.'],
 hints:['A snapshot at sequence N is only usable with updates strictly after N.','“At least once” messages mean consumers need duplicate detection, not just sequencing.'],
 model:'Publish instrument_id, sequence, event-time and schema version. A reconnecting client fetches an atomic snapshot labelled N, then applies updates N+1 onward. Buffer increments while obtaining the snapshot and discard all increments <=N; if the consumer sees a gap, stop applying, request retransmission or resnapshot. Use per-client bounded queues with explicit drop-and-resync instead of unlimited memory. Segregate hot instruments and compress/batch on separate fanout edges if permitted by SLO. Record end-to-end sequenced lag and recovery times; throughput calculations must include protocol framing, replication and burst factors.',
 rubric:['Correct snapshot+delta contract','Explicit gap recovery','Backpressure design','Quantitative egress model','Operational metrics and limitations']
},
{
 id:'recovery',number:'C',title:'Replay, failover and operational truth',minutes:60,
 task:'A primary matching partition crashes after writing some journal records but before clients receive all ACKs. Explain how a replacement leader can reconstruct state, avoid split-brain, and answer clients that retry without inventing executions.',
 constraints:['Matching events are deterministic and assigned partition-local sequence numbers.','Journal durability can outlast process lifetime.','A stale standby might not have the last few records yet.','External notifications and fills may have already been sent.'],
 steps:['Specify leadership and fencing; never allow two writers.','Define the log commit/ACK boundary.','Describe snapshot selection and event replay.','Recover prior request outcomes for deduplication.','Specify reconciliation with trade and client notification records.'],
 hints:['Deterministic replay alone is not a consensus algorithm.','Preventing double-processing requires durable idempotency decisions and fenced writer authority.'],
 model:'Use a leader epoch/fencing token to prevent stale primary writes. Only acknowledge durable committed events per the chosen consistency contract. On recovery, load snapshot at sequence S with a verified canonical fingerprint, apply the committed event suffix S+1 onward and stop on any gap. Rebuild the deduplication/outcome ledger. If clients retry uncertain requests, return the committed outcome when known, otherwise a clearly defined unknown/pending state that can be reconciled. Trade notifications should be idempotent and correlated with durable execution identifiers. The exact policy depends on synchronous replication, quorum protocol, and tolerated RPO/RTO; this simplified simulator does not solve distributed consensus.',
 rubric:['Fencing / single writer','Durability boundary','Snapshot + replay integrity','Idempotency and reconciliation','Operational recovery objectives']
}
];