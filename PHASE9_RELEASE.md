# Phase IX — C++20 Interview Defense

**New site:** `interview-cpp.html`  
**Existing compiler:** `cpp-wasm-worker.js` + pinned, same-origin Clang 22 assets  
**Course theme:** restrained academic Light/Dark, no artificial level locks.

## Implemented

- Six additional C++20 coding challenges with substantive theorem/proof-level explanations.
- Real browser Clang/WASI compilation of student implementations, deterministic examples, 24+ fresh generated cases per lab, and concrete failure reports.
- A two-distinct-seed competency marker. No fake certification or secret-test claims.
- Structured oral-defense checks (correctness invariant, time complexity, space complexity) **separate** from freely written and self-reviewed explanations.
- Counterexamples, concept-reference glossary, instructor derivation, worked trace, and follow-up interview constraints in each lesson.
- Local saved work, downloadable standalone `.cpp` harness, JSON export/restore and full Light/Dark parity.

## Source policy

Problem titles and publisher URLs link to LeetCode. The short prompts, worked examples, solutions, follow-ups and test generators are original Mastery material; the copyrighted original statements are not reproduced. Company associations, if viewed elsewhere in Mastery, remain third-party and unverified.

## Validation

Native C++20 six-lab reference suite: 522/522 cases across three distinct seeds; six incomplete starters fail tests as intended. Local Chromium UI workflow passes with a mock compiler Worker (not claimed as real compilation). Real browser Clang/WASM verification is separately required by GitHub CI.

**Technical notes:** `INTERVIEW_CPP_PHASE9_QA.md`.