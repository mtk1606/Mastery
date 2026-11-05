# Phase XIII — Foundation Academy (C0–C4)

**Release date:** November 5, 2026

## Why this exists
The three career paths—Quant Developer/Quant SWE, AI/ML Engineer, and Software Engineer—share essential Python, algorithms, mathematical reasoning and engineering fundamentals. Previously, C0–C4 were topic lists with links, not a consistently sequenced on-site learning experience. This release makes those 29 topics navigable instruction with formative assessments, examples, and transfer practice.

This is an **independent educational project**. It is not affiliated with, endorsed by, or academically certified as equivalent to MIT, Harvard or Waterloo. Treat those institutions’ public course materials as external references and benchmarks for the sort of reasoning and work students should practice—not as claims that our content has been peer reviewed at the same level.

## What is newly implemented

- **5 sequential modules / 29 original compact seminars:** C0 (5), C1 (6), C2 (6), C3 (6), C4 (6).
- Every chapter supplies: motivating question, definition, mechanism, worked example, *interactive stepwise trace* with at least three transitions, concrete counterexample, proof/invariant prompt, one source-visible four-choice reasoning question with explanation, and a changed-contract transfer exercise with an optional reasoning guide.
- Each stage has a **four-question scenario exit** separate from the chapter questions (20 additional scenario questions). Attempt history, latest score and best result persist locally.
- Progress distinguishes chapter recognition checks, stage scenario checks, self-written proof/transfer journals, and executable Python lab test cases. A correct recognition check does not automatically certify the student has proved an invariant. Feedback-assisted retries are labelled assisted.
- Spaced review after recorded correctness: next recall after 1 / 3 / 7 / 14 days. These review reminders are local; they do not send notifications or impose streaks.
- A near-black / graphite mobile-responsive teaching environment, accessible native radio fields, working labels, keyboard-accessible trace controls, local JSON export/restore and proper colour-theme persistence.
- A direct **Foundation** learning route for C0–C4 inside the career roadmap and main site navigation; prior roadmap, Focus, readiness, interview and C++20 state keys remain unchanged.
- **15 additional original Python exercises** spanning branching, prefix sums, collections, DSA, probability, linear algebra and production engineering. Alongside the 10 previous tasks there are **25 Python executable tasks with 209 inspectable deterministic fixtures**. Each task has a reference implementation, explicit complexity target, a failure pitfall and staged hints.

## Assessment validity and honest labels

| Artifact | Actual evidence |
|---|---|
| Completed example/trace | Exposure to an example; not a graded pass |
| Chapter quick-check | Correct recognition of a specific source-visible multiple-choice scenario |
| Stage exit | Best performance on four new, but still client-visible, formative scenarios |
| Written proof/transfer | Learner-authored content saved; it is not automatically proved correct |
| Python local pass | Source passed finite actual CPython/Pyodide tests; source changes invalidate credit, help is labelled |
| Interview-ready | **Not automatically determined.** Requires unfamiliar coding tasks, rigorous explanation and real interview defense |

The Foundation Academy is intentionally designed to avoid fake skill percentages, phantom points, punitive streaks or claims of automatic human-level proof grading. Source-visible formative questions can be memorized; successful stage exit is not a secure examination.

## Existing academic and software sources
- Harvard CS50P: https://cs50.harvard.edu/python/ — practical Python semantics and exercises.
- MIT 6.006: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ — assumptions, data structures, algorithm analysis and correctness.
- Open Data Structures: https://opendatastructures.org/ — proofs and asymptotic descriptions of core algorithms.
- Harvard Stat 110: https://projects.iq.harvard.edu/stat110/home — conditional probability and expectation.
- MIT 6.5840: https://pdos.csail.mit.edu/6.5840/ — distributed systems, consistency and failure.
- Official Python tutorial: https://docs.python.org/3/tutorial/ — language behavior and standard terminology.

No course or textbook content has been reproduced wholesale. All authored examples and quizzes are original.

## Reliability and test plan
- Validate unique IDs, 5-module stage order, all 29 chapter schemas and source references.
- Validate all 20 novel stage exit question explanations and correct answer indices.
- Independently implement 25 Python reference oracles and compare all 209 fixture results.
- Execute each *published* Python reference solution against the same fixtures, distinguishing mathematical float-tolerance tasks from exact integer/index tasks.
- Playwright Chromium: verify 5-stage navigation, case explanations, trace progression, assisted correction, written draft persistence, stage exit results, local export, 390px mobile layout, dark theme and roadmap deep links.
- Retest prior project Focus, Readiness, Phase VII, Phase X, C++/WASM and general site behavior before declaring the release verified.

## Limitations and next learning-quality milestone
These seminars are **compact, rigorous starting units**, not a full university-length course on every topic. Major professional software and ML modules still need full recitations, additional independently authored cases and expert editorial checks. The Python lab still downloads Pyodide on first execution and runs source in a Worker, not in a secure sandbox. Neither the browser code checker nor short multiple-choice exams can validate a general mathematical proof or evaluate communication like a human interviewer.

The next milestone should deepen the highest-value foundation topics with **fresh generated interview variants**, stronger numerical proofs, independent rubric review and difficult long-form labs. Then expand specialized Quant, AI/ML and SWE material. Progress must be based on demonstrable capability rather than time spent.
