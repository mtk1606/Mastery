/* Mastery Pathways v1 — audited navigation to real internal lessons and outside university references.
   A roadmap is not a completed course. All progression signals distinguish self-review from tested evidence. */
(function(root){
'use strict';
const refs=Object.freeze({
 cs50:{label:'Harvard CS50P · Python',href:'https://cs50.harvard.edu/python/',kind:'University reference'},
 mit006:{label:'MIT 6.006 · Algorithms and problem sets',href:'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',kind:'University reference'},
 waterloo:{label:'Waterloo CS240 · Data structures and correctness',href:'https://student.cs.uwaterloo.ca/~cs240/s26/',kind:'University reference'},
 ml:{label:'MIT 6.390 · Introduction to Machine Learning',href:'https://introml.mit.edu/fall26/info',kind:'University reference'},
 aster:{label:'Aster · C++20 market-data reconstruction',href:'https://github.com/mtk1606/aster-market-engine',kind:'Actual portfolio project'},
 agent:{label:'Agentic Markets · Python simulation',href:'https://github.com/mtk1606/agentic-markets-env',kind:'Actual portfolio project'}
});
const R=(label,href,kind='Existing Mastery lesson')=>({label,href,kind});
const U=k=>refs[k];
const S=(id,title,summary,topics,resources,exam,lab,transfer)=>({
  id,title,summary,topics,resources,exam,lab:lab||null,transfer,
  tier:id.startsWith('C')?'Common foundation':'Specialization',
  evidence:'Self-reviewed topics are not an objective certificate. Only executable Python lab passes are marked tested.'
});
const stages=[
S('C0','Orientation, baseline & how to learn','Begin as a novice. Make current gaps visible, then progress as quickly as genuine evidence permits.',[
 'How the three pathways overlap and differ','Variables, expressions, and evaluating simple functions','Input/output contracts and examples','Write a failing edge case before coding','How recall, proof, and repeat testing reinforce understanding'
 ],[R('Guided Foundation C0 · first principles and objective checks','foundation.html#C0','Mastery Foundation Academy'),R('Start: working Python lab','python-lab.html#sum_positive','Executable Python lab'),U('cs50')],{
  reason:'Distinguish recognizing a solution from recalling and writing it unaided.',
  implement:'Solve the starter exercise without looking at a solution.',
  defend:'Describe a counterexample your first implementation would mishandle.',
  transfer:'Change the input contract and describe how you would adapt.'},'sum_positive','Record a baseline, not a label about talent.'),
S('C1','Python fluency — from basics to reusable code','Master core Python language semantics before relying on libraries.',[
 'Numbers, collections, immutability and references','Control flow and comprehensions','Functions, closures, scope and recursion','Classes, dataclasses, iterators and generators','Exceptions, context managers and typing','Files, modules, virtual environments and package hygiene'
 ],[R('Guided Foundation C1 · Python engineering','foundation.html#C1','Mastery Foundation Academy'),U('cs50'),R('Python counters and data structures','python-lab.html#symbol_counts','Executable Python lab')],{
  reason:'Explain mutable default arguments, aliasing, iterators, and the cost of list versus dict operations.',
  implement:'Write solutions from a blank editor and add tests for empty and duplicate inputs.',
  defend:'Contrast shallow copies, deep copies and immutable values; state time/space complexity.',
  transfer:'Turn a pure function into a small reliable input-validation module.'},'symbol_counts','Write a frequency analysis utility that handles ties deterministically.'),
S('C2','Algorithmic thinking and data structures','Learn to recognize the few powerful patterns and prove why they work.',[
 'Asymptotics, amortized work and loop invariants','Hash maps, sets and frequency tables','Two pointers, sliding windows and prefix sums','Stacks, queues, trees and heaps','Binary search as a predicate','Graphs, recursion and dynamic programming'
 ],[R('Guided Foundation C2 · algorithm proofs','foundation.html#C2','Mastery Foundation Academy'),R('In-depth algorithm lectures','engineering.html#track=dsa&lesson=hash'),U('mit006'),U('waterloo')],{
  reason:'Identify the structural clue, select a data structure and derive a bound before coding.',
  implement:'Solve an unfamiliar two-pointer or window task in Python with executable tests.',
  defend:'Give initialization, preservation, termination and one smallest counterexample to the wrong method.',
  transfer:'Translate an array exercise into a stream of market events.'},'longest_unique','Prove the sliding window retains exactly the needed state.'),
S('C3','Mathematical reasoning and uncertainty','Make proofs and quantitative assumptions as routine as code tests.',[
 'Logic, induction, recursion and proof techniques','Combinatorics, conditional probability and Bayes','Expected value and indicators','Variance, sampling and confidence','Vectors, matrices, gradients and numerical precision','Optimization, constraints and probabilistic reasoning'
 ],[R('Guided Foundation C3 · mathematical reasoning','foundation.html#C3','Mastery Foundation Academy'),R('Discrete proofs and induction','index.html#/lesson/discrete-proofs'),R('Bayesian updating','index.html#/lesson/bayes'),R('Statistical inference','index.html#/lesson/inference')],{
  reason:'Derive an expression from assumptions rather than quoting a memorized formula.',
  implement:'Numerically verify a derived expression with small deterministic examples.',
  defend:'State which independence, finite variance or smoothness assumptions are required.',
  transfer:'Demonstrate one failure caused by violating the assumptions.'},'rolling_vwap','Treat units, precision and assumptions as part of correctness.'),
S('C4','Production engineering habits','A solution is not finished when it works once on a sample.',[
 'Testing pyramid, property tests and reproducibility','Git, readable pull requests and code review','Debugging, profiling and complexity measurement','SQL fundamentals, data modeling and transactions','APIs, protocols, errors and observability','Concurrency, security and fault handling'
 ],[R('Guided Foundation C4 · production reliability','foundation.html#C4','Mastery Foundation Academy'),R('Reliability and engineering case studies','phase5.html'),R('System design lectures','engineering.html#track=sd&lesson=sd-reliability'),U('waterloo')],{
  reason:'Specify invariants and failure modes, not only happy-path requirements.',
  implement:'Write tests for malformed input, duplicates, out-of-order events and idempotency.',
  defend:'Separate measured performance from a benchmark claim; quantify runtime and memory.',
  transfer:'Add metrics and a documented error contract to an existing service.'},'dedup_events','Explain how you would keep a processing pipeline correct under retries.'),
S('Q5','Quant probability & statistical inference','Connect random variables and estimation to market-facing engineering.',[
 'Combinatorics, conditional probability and Bayes','Expected value, indicator tricks and stopping rules','Variance, covariance and confidence intervals','Sampling bias, multiple testing and leakage','Monte Carlo methods and uncertainty estimates'
 ],[R('Probability sequence','index.html#/quant'),R('Statistics & inference','index.html#/lesson/sampling-inference'),U('aster')],{
  reason:'Derive an estimator and identify its sampling assumptions.',
  implement:'Implement a deterministic simulator and verify it against an analytic result.',
  defend:'Explain where IID approximations or normal tails fail.',
  transfer:'Interpret uncertainty in noisy market-data measurements.'},'rolling_vwap','Propose a reliable measured estimate, not an unqualified trading edge.'),
S('Q6','Market microstructure and order books','Understand the event grammar of markets before optimizing market code.',[
 'Limit orders, quotes, trades and tick sizes','Price-time FIFO and partial fills','Cancel, replace and execution event handling','Displayed depth versus hidden liquidity','Spread, adverse selection and market impact','Event ordering, feed integrity and sessions'
 ],[R('Order-book and microstructure lessons','index.html#/lesson/orderbook'),R('Market systems lab','market-systems.html'),U('aster')],{
  reason:'Describe exact state transitions for every order event.',
  implement:'Implement a reference FIFO data structure and deterministic event replay.',
  defend:'Show why replacements change priority and when a hash alone is insufficient.',
  transfer:'Check an independently computed snapshot against a C++ reconstruction.'},'dedup_events','Use a tiny event tape to expose duplicate/reordering problems.'),
S('Q7','Quantitative data pipelines and research','Move from a notebook result to reproducible research inputs.',[
 'NumPy, pandas and vectorization','Time zones, timestamps, corporate actions and missing data','Streaming, aggregation and online statistics','Lookahead leakage and point-in-time datasets','Backtests, baselines and experiment records','Research correctness versus profitable strategy claims'
 ],[U('agent'),R('Backtest validation and leakage','index.html#/lesson/validation'),R('Quantitative research lectures','index.html#/quant')],{
  reason:'Explain which observations would have been available at a decision time.',
  implement:'Build a point-in-time feature with a test that deliberately detects leakage.',
  defend:'Distinguish accounting truth from reported P&L and in-sample performance.',
  transfer:'Recompute an archived research metric from a saved transcript.'},'rolling_vwap','Replicate a quantity from raw events and document provenance.'),
S('Q8','Quant systems and data architecture','Design reliable real-time services with explicit performance budgets.',[
 'Market data ingestion, framing and sequence checks','Messaging, backpressure and queue disciplines','Stateful services and checkpoint/replay recovery','Memory layout and bottleneck location','Latency distributions, fan-out and failure budgets','Determinism, reproducibility and observability'
 ],[R('C++ exchange simulator and market systems','market-systems.html'),R('Durable systems','phase6.html'),R('Segmented replay','phase7.html')],{
  reason:'Define service boundaries, event ordering and failure recovery requirements.',
  implement:'Build an instrumented bounded queue or idempotent replay worker.',
  defend:'Estimate capacity and explain p99, memory versus I/O and backpressure.',
  transfer:'Trace an operational incident through event receipts and replay.'},'bfs','Use graph traversal to reason about dependency or recovery topology.'),
S('Q9','C++ performance bridge — your differentiator','Go deeper where Python interfaces with memory and hardware.',[
 'RAII, lifetimes, move semantics and stable ownership','Cache locality, allocation, data layout and profiling','Atomics, happens-before and thread-safe queues','C++20 compilation and memory-safe design tradeoffs','Python reference parity versus native performance','Aster code architecture and limitations'
 ],[R('Real browser C++20 laboratory','cpp-lab.html'),R('C++ interview defense','interview-cpp.html'),U('aster')],{
  reason:'State why a Python reference and C++ engine each serve a different purpose.',
  implement:'Reproduce selected Aster tests or extend a synthetic C++ fixture.',
  defend:'Explain one profile result with unit, hardware and validity limitations.',
  transfer:'Review a small optimized book update without mistaking throughput for latency.'},'binary_first','C++ is an optional depth layer, not a prerequisite for all Python interviews.'),
S('Q10','Quant Developer / Quant SWE interview defense','Synthesize algorithms, probability, market systems and your portfolio under time pressure.',[
 'Fresh Python DSA in an interview editor','Probability questions with written assumptions','Market pipeline and order-book design','Debugging, profiling and code review','Aster and Agentic Markets technical defense','Timed multi-round interview, postmortem and delayed retry'
 ],[R('Timed interview arena','phase10.html'),R('Question library and spaced review','readiness.html'),U('aster'),U('agent')],{
  reason:'Translate unfamiliar requirements into precise constraints before choosing a method.',
  implement:'Pass fresh, unseen test cases under a reasonable timebox.',
  defend:'Walk a reviewer through failure modes and what you actually measured.',
  transfer:'Modify a project contract and justify trade-offs while preserving correctness.'},'symbol_counts','Demonstrate technical ownership without overstating any portfolio metric.'),
S('M5','Linear algebra, calculus and optimization','Build ML mathematics before depending on black-box frameworks.',[
 'Vectors, matrices, rank and projections','Eigenvalues, positive semidefinite matrices and covariance','Derivatives, gradients, Jacobians and chain rule','Convexity, loss functions and optimization','Numerical stability and finite precision'
 ],[R('Linear algebra foundation','index.html#/lesson/linear-algebra'),R('Multivariable calculus','index.html#/lesson/multivariable'),U('ml')],{
  reason:'Derive a gradient of a simple least-squares loss by hand.',
  implement:'Implement gradient descent on a tiny dataset without ML frameworks.',
  defend:'Discuss conditioning, learning rate and why an iteration might diverge.',
  transfer:'Connect feature scaling to optimization behavior.'},'gradient_step','Prove the update equation before optimizing it.'),
S('M6','Statistical learning and classical ML','Understand what an ML algorithm is optimizing and how to evaluate it.',[
 'Train/test split, cross-validation and leakage','Linear/logistic regression, regularization','Decision trees, ensembles and bias–variance','Classification, calibration and imbalanced data','Feature pipelines and trustworthy baselines'
 ],[U('ml'),R('Statistical inference and regression','index.html#/lesson/regression'),R('Data leakage case study','index.html#/lesson/validation')],{
  reason:'Derive a baseline and a correctly chosen metric.',
  implement:'Train/evaluate a model with fixed seeds and a leakage-proof split.',
  defend:'Explain what a reported test metric does and does not prove.',
  transfer:'Diagnose feature leakage in market-like temporal data.'},'stable_sigmoid','A high score on contaminated evaluation is not success.'),
S('M7','Deep learning and modern architectures','Learn training mechanics rather than just calling a model API.',[
 'Neural networks and automatic differentiation','Backpropagation and optimization dynamics','Batching, normalization and initialization','Convolutions, sequence models and attention','GPU/CPU memory, mixed precision and reproducibility'
 ],[U('ml'),R('Gradient and optimization primer','index.html#/lesson/optimization')],{
  reason:'Trace a gradient across a multi-layer computation graph.',
  implement:'Train a small PyTorch model and ablate one design choice.',
  defend:'Explain overfitting, exploding gradients and scaling bottlenecks.',
  transfer:'Compare latency, memory and throughput for two deployment choices.'},'gradient_step','Document a learning curve and an independently checked baseline.'),
S('M8','LLM systems, retrieval and evaluation','Treat generation as an unreliable subsystem requiring evidence and guardrails.',[
 'Transformer attention and tokenization','Embeddings, ranking and retrieval augmentation','Prompting, tool use and bounded agents','Evaluation sets, failure taxonomy and drift','Privacy, security, prompt injection and hallucinations','Human review and grounded answers'
 ],[U('agent'),R('Reliability engineering lecture','phase5.html')],{
  reason:'Define a measurable evaluation target and a realistic failure taxonomy.',
  implement:'Create a reproducible retrieval evaluation with baseline metrics.',
  defend:'Explain where information can leak and how to audit agent claims.',
  transfer:'Use Agentic Markets transcripts to separate model reports from ground truth.'},'dedup_events','A useful AI system is evaluated, observed and constrained.'),
S('M9','ML infrastructure and MLOps','Deploy and maintain models like real production software.',[
 'Feature/data versioning and lineage','Training pipelines and experiment tracking','Model serving, inference latency and batching','Monitoring, alerting and data/model drift','CI/CD, security and reproducibility','Cost-performance tradeoffs and failure response'
 ],[U('agent'),R('System design fundamentals','engineering.html#track=sd&lesson=sd-capacity'),R('Operational failure modes','phase5.html')],{
  reason:'Define which artifacts are needed to reproduce a prediction.',
  implement:'Make a small deterministic model service with health and drift checks.',
  defend:'Separate correctness, evaluation and production SLOs.',
  transfer:'Audit a model release whose offline metric improves but online latency regresses.'},'bfs','Produce incident-ready logs and reproducible evaluation artifacts.'),
S('M10','AI / ML Engineer interview defense','Integrate algorithms, mathematics, model evaluation and production design.',[
 'Python coding and algorithm explanations','ML math derivations and experimental design','Training/evaluation debugging and data leakage','Model serving, system design and failure analysis','Project walkthrough and defended trade-offs','Timed mocks with delayed-error review'
 ],[R('Python practice lab','python-lab.html'),R('Readiness Academy','readiness.html'),U('ml'),U('agent')],{
  reason:'Choose metrics appropriate to the business and statistical question.',
  implement:'Fix a broken ML training or feature pipeline under test.',
  defend:'Explain the difference between an offline score, a causal claim and production impact.',
  transfer:'Give a project defense with limitations and reproducible evidence.'},'gradient_step','This track requires future substantial in-platform ML labs; university links are presently guided external reading.'),
S('S5','Advanced algorithms and proof techniques','Go beyond pattern recognition to algorithm design and complexity.',[
 'Amortized analysis and lower bounds','Graph algorithms and topological ordering','Dynamic programming design and correctness','Greedy exchange arguments and counterexamples','Tries, advanced heaps and balanced structures','Sorting, searching and hash collision models'
 ],[U('mit006'),U('waterloo'),R('Advanced algorithm lectures','engineering.html#track=dsa&lesson=graphs')],{
  reason:'State a loop invariant or induction hypothesis clearly.',
  implement:'Solve a fresh graph/DP problem using Python.',
  defend:'Give a tight complexity bound and an explicit counterexample to a tempting approach.',
  transfer:'Adapt the same method for streaming or weighted inputs.'},'bfs','Understand correctness before optimizing syntax.'),
S('S6','Backend engineering, APIs and databases','Build dependable software with explicit contracts and storage models.',[
 'HTTP/REST, authentication and input validation','SQL joins, transactions, indexes and isolation','Caches, rate limits, retries and idempotency','Async Python and network I/O','Testing, schema migration and backwards compatibility','Observability and incident triage'
 ],[R('Consistency and caching','engineering.html#track=sd&lesson=sd-consistency'),R('Durable systems','phase6.html'),U('cs50')],{
  reason:'Describe contracts at network, service and database boundaries.',
  implement:'Build a tested API that persists and retrieves versioned entities.',
  defend:'Explain read anomalies, retries and safe schema evolution.',
  transfer:'Turn a single-user endpoint into a replicated service design.'},'dedup_events','Make duplicate requests safe and measurable.'),
S('S7','Concurrency, distributed systems and reliability','Confront partial failure, concurrent execution and state recovery.',[
 'Threads, processes, async and race conditions','Locks, atomics, queue ordering and backpressure','Consistency, consensus and replication trade-offs','Event logs, replay and idempotency','Circuit breaking, timeout budgets and retry storms','Testing failure schedules and observability'
 ],[R('Reliability academy','phase5.html'),R('Distributed durability','phase6.html'),R('Segmented event replay','phase7.html')],{
  reason:'Start by specifying safety and liveness separately.',
  implement:'Test duplicate, delayed and reordered messages.',
  defend:'Describe exactly when a retry can create a second side effect.',
  transfer:'Simulate a crash between commit and acknowledgment.'},'dedup_events','Prove at-least-once processing cannot double-count a transaction.'),
S('S8','Systems design and scale','Reason from requirements, capacity and trade-offs rather than diagram templates.',[
 'API definitions and workload estimation','Storage, replication and cache architecture','Queues, service boundaries and data consistency','Horizontal scale and load shedding','Security, durability and regional failure','SLOs, cost and capacity planning'
 ],[R('Capacity estimation','engineering.html#track=sd&lesson=sd-capacity'),R('Systems interview exercises','phase7.html')],{
  reason:'List functional and nonfunctional requirements before proposing infrastructure.',
  implement:'Prototype a critical path with fault-injection cases.',
  defend:'Calculate steady-state capacity and worst-case burst handling.',
  transfer:'Redesign when throughput grows 100× while the consistency contract stays fixed.'},'bfs','Explain why your design meets the exact workload.'),
S('S9','Production platform, security and performance','Ship maintainable software under operational constraints.',[
 'Threat modeling, secrets and least privilege','Profiling, benchmarking and memory costs','Deployment and CI/CD rollback','Log/metric/trace correlations and incident response','Code reviews, architecture decision records and documentation','Test design, fuzzing and mutation testing'
 ],[R('C++ profiling and layout labs','cpp-lab.html'),R('C++ and system debugging','interview-cpp.html'),U('waterloo')],{
  reason:'Distinguish a speedup from a measurement artifact.',
  implement:'Investigate a reproducible performance regression with baseline and controls.',
  defend:'Identify monitoring blind spots and recovery steps.',
  transfer:'Turn a failure postmortem into a preventive test.'},'binary_first','Optimize only after measuring correctness and bottlenecks.'),
S('S10','Software Engineer interview defense','Apply the full loop to unseen coding, debugging, behavior and architecture.',[
 'Python coding against unfamiliar edge cases','Algorithms, proofs and asymptotic trade-offs','System design and operational failure','Maintainability, tests and observability','Behavioral project stories with evidence','Timed mocks and error-retention tests'
 ],[R('Full sourced question library','readiness.html'),R('Interview arena','phase10.html'),U('mit006')],{
  reason:'Make your reasoning clear enough that another engineer can verify it.',
  implement:'Produce correct code with tests and explain corner cases under a timebox.',
  defend:'Say what you measured, what you do not know and how you would test next.',
  transfer:'Debug the solution after a specification change.'},'longest_unique','Demonstrate generalizable competence, not memorized answers.')
];
const tracks={
 quant:{id:'quant',letter:'A',short:'Quant Engineer',name:'Quant Developer / Quant SWE',sub:'Python-first quantitative systems; C++ as a performance and architecture differentiator.',role:'Quant Developer and Quant Software Engineer',accent:'Market systems',ids:['C0','C1','C2','C3','C4','Q5','Q6','Q7','Q8','Q9','Q10']},
 ml:{id:'ml',letter:'B',short:'AI / ML Engineer',name:'AI / Machine Learning Engineer',sub:'Python engineering, mathematical foundations, model training, evaluation and reliable deployment.',role:'AI/ML Engineer and ML Platform Engineer',accent:'Model systems',ids:['C0','C1','C2','C3','C4','M5','M6','M7','M8','M9','M10']},
 swe:{id:'swe',letter:'C',short:'Software Engineer',name:'Software Engineer',sub:'Python problem-solving, algorithms, backend engineering and scalable software systems.',role:'Backend, infrastructure and generalist SWE',accent:'Production systems',ids:['C0','C1','C2','C3','C4','S5','S6','S7','S8','S9','S10']}
};
const map=Object.fromEntries(stages.map(s=>[s.id,s]));
const pace={sprint:{name:'Accelerated · 25 min',minutes:25,learn:6,code:12,explain:5,review:2},focused:{name:'Focused · 50 min',minutes:50,learn:14,code:25,explain:8,review:3},deep:{name:'Deep work · 90 min',minutes:90,learn:25,code:45,explain:15,review:5}};
function get(id){return map[id]||null;}
function forTrack(id){const track=tracks[id]||tracks.quant;return track.ids.map(get);}
function validate(){
 const ids=new Set(stages.map(s=>s.id));if(ids.size!==stages.length)throw Error('Duplicate roadmap IDs');
 for(const t of Object.values(tracks)){if(t.ids.length!==11)throw Error('Unexpected path length');if(t.ids.some(id=>!ids.has(id)))throw Error('Invalid stage');}
 for(const s of stages){if(s.topics.length<5||s.resources.length<1||!s.exam.reason||!s.exam.implement||!s.exam.defend||!s.exam.transfer)throw Error('Unsubstantiated stage '+s.id);}
 return true;
}
const api={version:'v1',tracks,stages,pace,refs,get,forTrack,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryRoadmap=api;
})(typeof window!=='undefined'?window:globalThis);
