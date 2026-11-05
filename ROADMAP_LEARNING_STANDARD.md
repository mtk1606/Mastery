# Mastery A–Z Learning Standard — Phase XII
**Release:** 2026-11-05 | **Status:** Guided 3-track pathway + first ten executable Python micro-labs; most later-stage deep labs remain future work.

## Mission
One coherent beginning-to-interview pathway with three genuine destinations:
A. **Quant Developer / Quant SWE (primary):** Python and quantitative pipelines, engineering design, probability, order books and optional performance-oriented C++ defense.
B. **AI / Machine Learning Engineer:** Python, linear algebra, probability, supervised learning, deep learning, LLM evaluation and ML infrastructure.
C. **Software Engineer:** Python algorithms, backend services, concurrency, databases, reliability and system design.

**Five stages C0–C4 are shared.** Each pathway then has six distinct advanced stages, for eleven ordered stages per route and 23 distinct stage descriptions. Shared progress survives switching. All stages remain open; there are no forced gates, age-based rankings, rewards for screen time or fake interviews.

The learner starts at novice level but can move quickly. **Fast means fewer redundant explanations for demonstrated knowledge, not omitted prerequisites.** The goal is interviewing competence, not a promise of any specific offer or comprehensive university equivalence.

## Every stage follows the same method
1. **Understand:** define entities, constraints, assumptions and failure cases; be able to paraphrase the concept without access to notes.
2. **Recognize:** connect a fresh prompt to structural clues; distinguish it from adjacent techniques.
3. **Implement:** Python-first and without copying a reference, using a contract, edge cases, tests and complexity reasoning. C++ used where needed for low-level understanding, performance or Aster.
4. **Defend:** name an invariant/proof sketch; derive the time/space complexity; identify a misleading shortcut or counterexample.
5. **Transfer:** modify a constraint, apply to a different context or explain an engineering trade-off.
6. **Review:** schedule another unaided attempt after a delay; record help and failed cases, not mere exposure.

### Suggested focus blocks
Accelerated: 25 minutes (6 understand, 12 implement, 5 explain, 2 recap).
Focused: 50 minutes (14 understand, 25 implement, 8 explain, 3 recap).
Deep: 90 minutes (25 understand, 45 implement, 15 explain, 5 recap).
A focus timer is an aid to planning, not a measurement of subject competence. Time spent does not earn skill credit.

## Source-grounded academic design
Mastery is an independent project unaffiliated with MIT, Harvard and Waterloo. Its pedagogy is **informed by their public materials**, not equivalent to accreditation, faculty review or exam certification.

- **MIT 6.006 Algorithms** — https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ — prerequisites include Python and discrete mathematics, and graded material includes algorithmic analysis, problem sets, quizzes and exams. This informs the entry diagnostic, invariants, complexity requirements and unseen application.
- **Harvard CS50P** — https://cs50.harvard.edu/python/ — functions, types, exceptions, tests, object-oriented Python and substantial exercises. This informs beginner-to-code-first sequencing and test-before-credit.
- **Waterloo CS240 (Spring 2026)** — https://student.cs.uwaterloo.ca/~cs240/s26/assignments.phtml — emphasizes describing an algorithm, justifying correctness, bounding runtime and programming to a testable specification. This informs the four-part exit rubric.
- **MIT 6.390** — https://introml.mit.edu/fall26/info — assumes programming and linear algebra prerequisites and includes hands-on labs and recitations. This informs the AI track math → ML → deployment sequencing.
The external resources are linked, not copied or implied to endorse Mastery.

## Progress evidence hierarchy (do not confuse levels)
| Label | What it *actually* means |
|---|---|
| Topic reviewed | Learner manually indicated understanding; can be undone any time. |
| Stage self-reviewed | Every topic checked and a deliberate manual review recorded; schedules next recall after 1/3/7/14/30/60 days. |
| Python local pass | The submitted source passed all inspectable deterministic cases in a real Pyodide CPython Worker; the current source and the help flag are recorded. |
| Defense-ready | **Not currently automated.** Requires unfamiliar tasks, independent review of proofs, genuine production-style work, and human mock interviews. |

Source changes invalidate the corresponding Python pass. A broken run is not a successful result. Using a hint marks the recorded attempt **assisted**. Exportable progress files are local and editable; they cannot prove identity, reproduce remotely verified marks or qualify as employer certifications.

## Available labs in this release
Python: positive-sum loop invariant; dictionary counters; longest-distinct-character window; first-occurrence binary search; weighted VWAP; event idempotency; breadth-first search; scalar gradient descent; numerically stable sigmoid; fixed-size maximum window sum. All tasks have original, explicit contracts, invariants, targets, common traps, reference solutions and at least eight deterministic cases. A separate independent Python oracle validates every fixture in CI.

The Python editor runs in a **real Web Worker** with pinned Pyodide 0.27.7 CPython WebAssembly via jsDelivr. The first use requires a network connection and downloads runtime assets; code is evaluated in the browser, not a remote Mastery judge. A 45-second watchdog terminates a stuck Worker. **This is not a security sandbox:** do not paste credentials or execute untrusted submissions. Tests are inspectable in the client; a pass demonstrates only finite-case behavior, not formal correctness. The existing C++20 laboratory remains available separately.

## Projects used as evidence, not unsupported achievements
- Aster — https://github.com/mtk1606/aster-market-engine — C++20 historical Nasdaq ITCH replay and displayed order-book reconstruction, independent bounded Python reference checks and transparent throughput/RSS measurements. **Not** a live exchange connector, strategy, or a certified all-stock replay.
- Agentic Markets — https://github.com/mtk1606/agentic-markets-env — Python deterministic simulation, point-in-time market access, event/accounting ledgers and replayable experiments. Large-scale sandbagging and deception research results are not yet claimed in that repository.

The roadmap links these as applied transfer material. It does not automatically import user GitHub profile progress or grade code there.

## Quality engineering
- Deterministic roadmap data validators for correct prerequisites, nonempty sources, unique stage names and complete exit rubrics.
- Independent Python implementations check the case fixtures.
- Real Playwright tests verify pathway switching, shared-state continuity, mobile overflow, dark theme contrast, assessment integrity, source edits and navigation.
- Existing Mastery academic/reference, Focus, C++/WASM, market systems, readiness and interview workflows must continue passing.

## Explicit gaps / highest-impact subsequent releases
1. **More substantive original lectures for stages C1 and later.** Every mapped syllabus topic needs definitions, worked derivations, visual traces, two nontrivial examples, counterexamples, and progressive formative exercises. At release, advanced AI and backend stages often link outside material rather than fully authored on-site courses.
2. **Scale Python tests from ten original problems to an independently cross-checked graduated bank.** Include property-based generators, memory and time constraints, AST-level diagnostics, debugging traces, and realistic interview-mode task rotations.
3. **Genuine AI/ML practicals:** NumPy/pandas, regression, numerical gradients, train/validation/test leakage, model serving and monitored drift using reproducible local fixtures. Do not grade ML accuracy without proper experiment design.
4. **Production backend practicals:** HTTP APIs, SQL transaction isolation, queues, retry budgets, fault injection, structured logs and systems interview cases.
5. **Portfolio defense:** repository-linked Aster and Agentic Markets implementation walkthroughs, correctness challenges and architecture questions, with tests users can run on synthetic datasets.
6. **Inclusive UX and performance:** run full WCAG 2.2 screen-reader reviews, network-throttled Lighthouse and load testing on mobile, benchmark the Python runtime, cache heavy assets responsibly and assess CDN availability. Current audits are functional smoke tests, not universal accessibility/performance certifications.
7. **Periodic independent editorial review** for mathematical correctness, accurate citations and ambiguous problem wording. The scope and rigor of university coursework should be the benchmark for our content quality; it has not yet been fully matched.

## Why this release is useful already
It makes the path, outcomes and source/evidence boundaries explicit, preserves prior work, and supplies a real first Python practice environment. It is a **foundation for hundreds of hours of future study**, not a misrepresented complete education on day one.
