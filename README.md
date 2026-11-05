# Mastery — A–Z Quant / AI-ML / Software Engineering Learning Paths

**Live website:** https://mtk1606.github.io/Mastery/

**Start your career roadmap:** https://mtk1606.github.io/Mastery/roadmap.html

**Practice real Python:** https://mtk1606.github.io/Mastery/python-lab.html

**Start practicing:** https://mtk1606.github.io/Mastery/focus.html

## Figure Quality Reboot · Book-quality diagrams before more volume

The initial visual labs were numerically checked but not sufficiently clear as teaching figures. The first redesign corrects that standard: [Insertion sort — original six-panel indexed-array figure](insertion-sort.html) shows the full input-to-output progression, element-shift arrows, sorted-prefix shading and code linked to the exact states. Try mixed, sorted, and reverse inputs. The [Bayes probability chapter](foundation.html#C3/c3-counting) now uses a one-person-per-mark 1,000-person frequency plate, not a four-card dashboard. Diagrams are original, inspired by the pedagogical approach of classical algorithm figures, not copied from textbook PDFs. Read [the visual quality acceptance standard](VISUAL_FIGURE_QUALITY_PHASE15.md). Remaining generic figures need the same editorial redesign in later batches; model-level tests alone are not considered proof of diagram quality.

## Phase XIV-D · Six systems and reliability visual laboratories

All **six C4 Foundation lessons** now have state-accurate, original SVG visual simulations: event deduplication, reproducible bug-fix review, nearest-rank p50/p95/p99 latency and throughput, atomic ledger transfers, retry idempotency and two-worker races. Switch between safe and unsafe scenarios and see the *actual modeled* committed balances, accepted IDs, request outcomes and worker reads. The scenes retain pause/replay, a complete text trace, prediction checks, dark/light themes and mobile panning, with no fictitious code or learning credit. That makes **27 Foundation visualizations across C0–C4**. [View the Systems reliability release report](VISUAL_SYSTEMS_PHASE14D.md) or [try the transaction visual](foundation.html#C4/c4-sql).

## Phase XIV-C · Six quantitative mathematics visual laboratories

All **six C3 Foundation chapters** now have a grounded, interactive mathematical diagram:

- Induction as growing squares, with a selectable proof step.
- Bayes from actual counts of 1,000, with adjustable prevalence and updated posterior/prediction questions.
- Indicator expectation from dependent urn draws, with exact combinatorial probabilities.
- Sampling variance from the **exact Binomial distribution** of a Bernoulli sample mean, with adjustable p and n.
- Four linear maps of selectable vectors, showing basis images, input and transformed vectors.
- Exact one-dimensional gradient descent on a quadratic, including overshoot under a large learning rate.

Every visualization retains the existing pause/step/replay, screen-readable text trace, dark/light accessibility and **no automatic learning credit** policy. This completes 21 total visual labs (15 C0–C2 plus six C3); C4 reliability and specialized Quant/AI/SWE diagrams remain future phases. See [Phase XIV-C notes](VISUAL_MATH_PHASE14C.md) and [Foundation Academy](foundation.html#C3/c3-counting).

## Phase XIV-A/B · Original visual learning (15 integrated figure labs)

Foundation Academy now has **15 original, interactive SVG concept visualizers** across C0–C2. They show real state transitions and invariants, with Next/Previous, Play/Pause/Replay, an accessible text trace, prediction prompts, and parameter-changing exercises for sliding windows and binary search. The diagrams are original, lightweight, dark/light compatible, reduced-motion aware and explicitly non-credit-bearing. Start with [shared references and mutation](foundation.html#C0/c0-state), [sliding windows](foundation.html#C2/c2-windows), [binary search](foundation.html#C2/c2-binary) or [BFS layers](foundation.html#C2/c2-structures). [Coverage, correctness evidence and source transparency](VISUAL_LEARNING_PHASE14.md).

## Phase XIII · Foundation Academy C0–C4

**Begin here: [Foundation Academy](foundation.html).** All five common stages now have **29 original concept seminars** with guided state traces, counterexamples, proof/transfer prompts, individual quick-checks, and four distinct stage-exit scenarios each. The Python lab has **25 real CPython exercises**, with **209 deterministic test cases** checked against independently written Python oracles and published reference solutions. Lessons, recognition checks, self-reviewed proofs and executable passes are separate evidence categories; this is not an accredited university course. [Read the Phase XIII quality report.](FOUNDATION_ACADEMY_RELEASE.md)

## Phase XII · three real career tracks

The default path is **A · Quant Developer / Quant SWE**, with **B · AI/ML Engineer** and **C · Software Engineer** available as first-class alternatives. Five shared foundation stages, six role-specific stages, explicit topic inventories, academic source links and four-part exit rubrics make the order unambiguous. The now 25 Python exercises execute in a real Pyodide CPython Web Worker; progress labels distinguish self-review from finite local test passes. [Read the learning standard, academic grounding and honest current limitations.](ROADMAP_LEARNING_STANDARD.md)

## Choose one next action

| Your objective | Start here | Objective evidence |
|---|---|---|
| Navigate all 11 stages for your chosen role | [A–Z roadmap](roadmap.html) | Self-reviewed concepts vs. executable evidence are separate |
| Write, run and debug Python on real cases | [Python laboratory](python-lab.html) | Actual CPython execution in a disposable Worker, with test fixtures and recorded help |
| Build daily fluency in ~5 minutes | [Focus learning desk](focus.html) | Three original numeric and reasoning checks, assisted work labelled |
| Learn foundations deeply | [Mathematics / Quant course library](index.html) | Lectures and optional exams; studied marks are self-reported |
| Practice real coding and invariants | [C++20 Interview Defense](interview-cpp.html) | Actual Clang/WASM finite-case test runs and separate proof checks |
| Retrieve sourced algorithm questions | [Readiness Academy](readiness.html) | Community source labels, due reviews and selected Worker-backed JS tests |
| Simulate interview pressure | [Phase X Interview Arena](phase10.html) | Conditional follow-ups and per-round coding/numeric results |

The Focus page is the recommended entry point; it links to every other track and does not replace the full lessons. All content remains available without progression gates. See [the Focus UX release notes](PHASE11_UX_RELEASE.md) for motivation safeguards and assessment limits.

Mastery is an independent, university-style, open-access learning project. It is not affiliated with Harvard, MIT, Oxford, or a trading firm.

## Current course catalogue

| Course | Available lectures | Learning focus |
|---|---:|---|
| Mathematics | 13 | mathematical fluency, proof, calculus, matrices and inference |
| Probability & Quantitative Finance | 22 | expected value, probability, statistics, research, market microstructure |
| Data Structures & Algorithms | 10 | recognition, invariants, code, traces, complexity and interview questions |
| Modern C++ & Market Systems | 4 | ownership, cache locality, concurrency and price-time matching |
| System Design | 3 | capacity, consistency and failure handling |

All 52 current lectures are available without progression gates. Written notes and progress remain stored in each browser; users can export/import progress backups from the existing course pages.

## v5 improvements

- Consistent course catalogue and academic design. Minimal decoration, useful hierarchy, real chapters, proof-based learning.
- **Light and Dark** buttons in both sites; selection persists in local storage under `mastery-theme`.
- Normal neutral palette and readable standard typography: Arial/Segoe UI for interface, Georgia for academic titles, system monospace for code.
- Math and Quant legacy content and test generators are retained. The layout removes decorative styling and keeps optional figures subordinate to teaching.
- Five in-depth, original **companion seminars** in engineering: linked-list pointer invariants, dynamic programming recurrence design, C++ object lifetime/RAII, price–time order-book matching, and distributed consistency/idempotency. Each adds detailed assumptions, derivations/proofs, worked examples, counterexamples, and recitation questions with solution sketches.
- The existing step-by-step DSA code traces and chapter glossaries are retained.
- No restrictions or grade-based lesson locks.

## Files

- `index.html`, `app.js`: main catalogue, mathematics, probability/quant courses, assessments.
- `engineering.html`, `engineering.js`, `engineering-data.js`: algorithms, C++ and system design.
- `theme.js`: shared, persisted light/dark selection.
- `academic.css`: shared editorial design system loaded after old styles to preserve old UI behavior.
- `faculty-notes.js`: independent substantive companion seminars for 5 engineering lessons.
- `styles.css`, `dark.css`, `scholar.css`, `visuals.js`, `data.js`, `pedagogy.js`, `seminar.js`: legacy curriculum and interactive components.

GitHub Pages builds from `main` at `/ (root)`; no backend or bundler is required. A Python static server can be used locally with `python -m http.server 8000`.

## Educational source policy

Content is independently authored, informed by (but not copied from):

- MIT 6.006 Introduction to Algorithms: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- Harvard CS50: https://cs50.harvard.edu/x/
- Open Data Structures: https://opendatastructures.org/
- cppreference: https://en.cppreference.com/w/
- MIT 6.5840 Distributed Systems: https://pdos.csail.mit.edu/6.5840/
- C++ Core Guidelines: https://github.com/isocpp/CppCoreGuidelines
- *Introduction to Probability* by Blitzstein & Hwang; Xinfeng Zhou's interview guide; and Avellaneda & Stoikov's market-making paper (provided references).

Linked sources and published academic materials retain their respective licences and copyrights; they are **not** incorporated wholesale into Mastery.

## Quality and limitations

See `QA_REPORT_v5.md` for checks. In-browser tests used an HTML/CSS/JavaScript DOM assembly because local browser navigation in the test environment was blocked; pages are ordinary static HTML and GitHub Pages deployment should be checked separately.

**Not yet built:** server-side compiled code evaluation, automatic grading of free-text proofs, full-size semester syllabi for every subject, or multi-device synced progress. The five deeper engineering seminars are a first quality standard; the other lessons are not all at the same depth yet.

## Next instructional phase

Bring every engineering lesson up to the flagship-seminar standard, then build a real code-execution and unit-testing environment with role-specific problem sets and design critiques. Audit mathematical accuracy and citation coverage before using the material as a complete replacement for university courses.
## Academic Depth Phase — November 4, 2026

The academic learning layer is **implemented** in `academic-labs.js` and `academic-labs.css`, reused by both the Math/Quant site and the Engineering Academy.

- **All 52 lectures now have two independent recitation problems each (104 total)**, with two progressive hints, an original worked solution, and an explicit reasoning checklist.
- **All 17 Engineering lectures now have recitations.** The 12 previously lighter Engineering lessons also receive a companion extension covering assumptions, derivation or correctness, an exact worked example, and a failure case. The existing five long-form faculty seminars are retained.
- **All 35 Math/Quant lectures** now have two extra recitations each, including proofs, calculations, modeling limits, and harder transfer problems.
- Written responses are saved as local drafts; the existing course progress exporters now include them as `workshopAnswers`. Restores accept older progress formats without discarding unrelated saved drafts.
- Written proofs and architecture answers are **not automatically graded**. Students reveal model reasoning and use a checklist to review their work; numerical quick-checks remain distinct.
- **No grading gates, forced retakes or locked lessons.** Optional figures remain optional. Light and Dark themes are unchanged.

### Educational standards and readings

Independent educational work guided by the lecture/recitation/problem-set structure of [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/resource-index/), the free, openly licensed [Open Data Structures](https://opendatastructures.org/), [MIT 6.5840](https://pdos.csail.mit.edu/6.5840/) for distributed-systems rigor, the C++ Core Guidelines, the user-provided Blitzstein–Hwang and Zhou books, and the provided Avellaneda–Stoikov (2008) paper. Material is independently authored, not copied or officially endorsed.

### Quality limits

Automated QA: 54/54 browser-DOM interaction checks, syntax checks for modified JS, and a coverage audit confirming 17 engineering + 35 math/quant topics, two original problems each. Browser checks use inlined local assets because local web navigation is restricted in the test environment. This is an incremental educational enhancement, not a claim of formal peer review or exhaustive mathematical proof auditing. No remote code execution, AI grading of free text, or cross-device accounts have been added.


## Programming Laboratories — Phase 1 (November 4, 2026)

**Live laboratory:** [Programming Laboratories](labs.html). Eight **JavaScript** exercises run directly in disposable browser Web Workers with **56 actual deterministic tests**, deliberate bug variants, stress cases, results and 6-second timeout. These are browser JavaScript exercises, not C++ compiled in the browser.

**C++20 native projects:** [cpp/](cpp/) contains three compiled and tested projects: two sum, SPSC ring buffer with a 100,000-transfer concurrent test, and a price-time limit order book. Each has a student TODO header, separate reference solution and native CTest; a C++ microbenchmark reports local p50/p95/p99 observations. Reference C++ suite passed Debug, Release and ASan/UBSan on the development Linux toolchain. Incomplete student variants intentionally fail until implemented.

The website preserves its Light/Dark setting, carries no learning locks, and exports/restores local laboratory drafts. A third-party C++ browser compiler link is optional and cannot replace the native verification suite. See [laboratory instructions](labs.html), [C++ setup](cpp/README.md) and [lab QA report](PROGRAMMING_LABS_QA.md). No live backend, user-account sync, AI grading of proofs, or server-hosted arbitrary C++ execution has been added. This is an independently authored course project, not affiliated with any university or trading firm.


## C++20 WebAssembly Programming Lab — Phase II (November 2026)

**New course:** [C++20 & Market Systems Laboratory](cpp-lab.html). Four guided labs teach hashing invariants, linked-list pointer identity, bounded ring buffers, and deterministic price-time order matching. The browser executes **real C++20** through a Web Worker with a pinned [Clang/WASI 0.3.0 runtime](CPP_WASM_LABS_README.md), not through JavaScript translation. Native reference solutions pass **30/30** compiled assertions in g++14. The browser compiler is separately smoke-tested with Chromium in the [C++/WASM CI workflow](.github/workflows/cpp-wasm-ci.yml).

The browser runner's ~303 KB MIT-licensed JavaScript wrapper is vendored with notices; compiler binaries and sysroot are now served from the pinned **same-origin `clang/` directory** on GitHub Pages (approximately 29 MB compressed), with an immutable npm CDN fallback. The 30/30 actual Chromium Clang/WASI tests and local-asset selection are recorded in [the Phase II QA report](CPP_WASM_PHASE2_QA.md). The C++ execution target is WASI, so concurrency, sanitizers and hardware latency require the native `cpp/` lab suite. Reference diagrams are explicitly independent from the learner's compiled code. Local code drafts, downloadable C++ source and JSON backup are included.

## Phases III & IV — Advanced Market Systems Engineering (November 2026)

**New university-style module:** [Market Systems Engineering](market-systems.html). Four advanced lectures (matching invariants, deterministic replay and sequence gaps, C++ memory/`std::pmr`, native measurement methodology), a real editable reference event tape, and three substantial open-ended distributed-systems design workshops (risk/order gateway, sequenced market-data fanout, failover/recovery).

**Native C++20 project:** [exchange/](exchange/README.md). Includes a price–time FIFO matching engine with integer ticks, ID-indexed cancellation, market IOC, partial fills, strict sequencing, reproducible replay and a pinned cross-language regression fingerprint. CTest verifies the book invariants, golden fixture and memory-resource experiment, and additional deterministic random tests run under sanitizers. Native microbenchmarks output machine-measured p50/p95/p99 JSON for the website's upload viewer. **No synthetic timing data is shown as a real measurement.**

**System design learning:** Three specification-driven architecture studios include failure requirements, worked designs, gradual hints and self-review criteria. A fanout capacity worksheet supports quantitative estimates. No lesson locks, and all free-text work remains local with export/restore. Light/Dark themes are shared with the existing courses.

**Quality and limitations:** GitHub Actions workflow `.github/workflows/market-systems-ci.yml` compiles and tests the native simulator, verifies a deterministic C++ / browser reference checksum, and performs a real browser HTTP journey test. The visualizer is a distinct JavaScript reference model, not an instrumented C++ debugger. This system is educational and not suitable for live securities execution. See [Phases III–IV roadmap](MARKET_SYSTEMS_PHASES_3_4.md) and [C++ README](exchange/README.md).


## Phase V — Reliability engineering and interview simulations (November 2026)

The [Phase V course](phase5.html) adds **six original faculty-style lectures** (multi-symbol routing, checkpoint+delta recovery, leader epoch fencing, backpressure, property testing, and performance measurement), **two interactive reference laboratories** (snapshot/sequence-fault recovery and bounded subscriber queues), and **four timed SWE/quant-dev/low-latency/system-design interview rounds** with optional pauses, full solutions, explicit self-review criteria, local notes and JSON export/import. All lessons are open and have the shared Light/Dark design.

The new native [Phase V C++20 project](phase5/README.md) extends `Exchange` with FIFO-preserving snapshot export/import. Its independently testable `Venue` routes globally sequenced messages to per-symbol books, validates checksummed logical checkpoints before swapping state, rejects stale epochs, and models bounded all-or-nothing fanout. Native tests cover a pinned cross-language checkpoint and golden hash, corrupted/torn checkpoints, 4,000 seeded messages, sequence gaps and queue saturation. The browser uses a separately written JavaScript reference and does **not** trace arbitrary C++ program execution.

[Phase V CI](.github/workflows/phase5-ci.yml) compiles/tests with sanitizers and runs actual HTTP/Chromium browser flows. The course is educational—not a crash-durable distributed exchange or a source of proprietary interview questions. Details in [Phase V source notes](phase5/README.md) and [release QA report](PHASE5_QA.md).


## Phase VI — Durable Recovery & Isolated Subscriber Replay (November 2026)

The new [Phase VI module](phase6.html) includes five proof-oriented lectures, two interactive failure experiments and three open written design defenses. Its native [Linux/POSIX C++20 reference](phase6/README.md) implements an fsynced append-only WAL prior to acknowledgement, recovery of client-key idempotency receipts, strict log framing, a deliberately injected process crash after WAL fsync, and bounded per-subscriber retention with resnapshot-required gap handling.

The course is open-access and preserves Light/Dark themes and JSON note backups. Browser models are **instructional representations**, not traces of arbitrary learner C++. This is not a power-cut-certified or distributed consensus storage engine. See [release documentation](PHASE6_RELEASE.md) and the [Phase VI CI workflow](.github/workflows/phase6-ci.yml).


## Phase VII — Segmented Journals and Interview Academy (November 2026)

[Phase VII](phase7.html) adds rigorous crash-recovery lectures, six reference fault scenarios, and a native [segmented C++20 WAL](phase7/README.md) with fsynced records, idempotency receipts, checksum validation, crash points, staged checkpoint publication, compaction, and 3,000 seeded transactions under Debug/ASan/UBSan. The browser visual is **not** an instrumented C++ execution trace. The scope is a single-writer educational POSIX process-crash model, not guaranteed power-loss durability or consensus.

[Mock Interview Academy](mock-interviews.html) adds **25 independently worded, source-labelled questions for eight target companies**, including Jane Street's published retired Memo example, publicly company-tagged LeetCode titles for Citadel/Meta/Google, and original exercises for trading, SWE and low-latency systems. Users can run 25/45/60-minute sessions, write answers or code, reveal staged follow-ups, manually score five dimensions, and export/restore progress. **Company tags are not proof of actual historical interview appearance; self-scores do not certify hiring readiness.** No private, proprietary or paywalled question statements were copied. See [source audit](MOCK_INTERVIEW_SOURCES.md), [release notes](PHASE7_RELEASE.md), and [GitHub CI](.github/workflows/phase7-ci.yml).


## Phase VIII — Interview Readiness Engine (November 2026)

[Interview Readiness](readiness.html) introduces a source-audited **284-item community-tagged LeetCode catalogue** (plus the previous 25 guided interview briefs, for 309 total), targeted company filters, timed 25/45/60-minute simulations, original technical follow-ups, an objective-vs-subjective assessment record, and spaced repetition. It links to source statements rather than copying their copyrighted text. **A third-party company tag does not verify that the firm historically asked the question**; this distinction is prominent on the site. Employers are not affiliated with Mastery.

**Real code evaluation:** ten JavaScript patterns run deterministic and freshly seeded test cases in a disposable browser Worker; each case yields a verifiable pass/fail, with a 4-second timeout and detailed error feedback. The actual C++20 compiler remains in [the dedicated C++ laboratory](cpp-lab.html). All other problems are linked for independent problem-solving and are not falsely marked as autograded.

**Readiness evaluation:** manual five-dimensional rubrics for ungraded reasoning, automatically tracked code passes, timed rounds, a weak-concept record, and one/three/seven-day-plus due review scheduling. All content is unlocked; browser records export/import as JSON. A completed syllabus or self-score does not guarantee interview success. See [source methodology](INTERVIEW_READINESS_SOURCES.md), [release limits](PHASE8_RELEASE.md) and [automated CI](.github/workflows/readiness-ci.yml).


## Phase IX — C++20 Interview Defense (November 2026)

The [C++20 Interview Defense laboratory](interview-cpp.html) expands Mastery’s existing four browser Clang/WASM exercises with **six new full C++20 interview challenges**: valid parentheses, binary search, sliding window maximum, interval merging, coin change, and LRU cache. Each has original lecture notes, explicit prerequisites/function explanations, a correctness invariant, proof, counterexample, worked reference trace, source URL, new follow-up constraints and a separate structured oral-defense assessment. Written proofs and explanations are self-reviewed, **not automatically graded**.

The same-origin pinned Clang 22/WASI worker compiles actual student C++20 and executes client-side deterministic and freshly generated test cases, displaying compiler diagnostics and concrete failing inputs. The native g++ reference test suite passed **522/522 cases** across three seeds; all incomplete starter implementations failed testing as expected. Repeating a pass on two distinct seeds contributes to a practice record, **not a certification or guarantee of interview success**. The real browser Clang/WASM integration has its own [GitHub CI workflow](.github/workflows/interview-cpp-ci.yml) and must be checked separately from native testing.

All levels remain open with Light/Dark themes and local progress export/import. Source: [Phase IX documentation](PHASE9_RELEASE.md), [QA and boundaries](INTERVIEW_CPP_PHASE9_QA.md). Original teaching material links to publisher-hosted LeetCode questions without copying proprietary statements. Client-generated tests are not secure hidden tests.
