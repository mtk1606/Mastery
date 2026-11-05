# Mastery Interview Readiness — sources, grading and editorial scope

## Provenance

The Phase VIII bank is a snapshot gathered **November 5, 2026** from a third-party repository: [liquidslr/leetcode-company-wise-problems](https://github.com/liquidslr/leetcode-company-wise-problems), specifically its listed `2. Three Months.csv` and `5. All.csv` files. It contains **284 distinct question-title/official-LeetCode-link records** associated with Citadel, Jane Street, Hudson River Trading, Google, Meta, Amazon, Apple, Netflix, Microsoft, Bloomberg and Stripe. Multiple employers can be associated with one title. The new bank is supplemented by **25 existing independently worded, source-labelled practice briefs** in `mock-questions.js`, for **309 distinct tasks**.

**What these tags do NOT establish:** that a company actually asked a particular question of a given candidate, that the data is authoritative or complete, or that the reported frequencies and time-window labels are accurate. Those frequencies are not imported into this release. The original LeetCode statements live on LeetCode; Mastery links to them without reproducing them. Community-labelled entries are never displayed as officially confirmed.

Jane Street's independently verified, publicly published retired **Memo** example remains in the existing question collection, as do original trader/quant/system-design practice briefs. Employer names are informational, not affiliation or sponsorship.

## Executable checks

Ten problem patterns (`Two Sum`, `Valid Parentheses`, `Binary Search`, `Sliding Window Maximum`, `Reverse Linked List`, `Merge Intervals`, `Coin Change`, `Longest Unique Substring`, `Top K Frequent`, `LRU Cache`) have an in-browser **JavaScript** editor and runnable deterministic unit tests plus different seeded cases. Reference solutions are regression-tested by CI over three different seeds each (more than 700 individual case executions). The browser worker is disposable, and execution has a 4-second timeout.

A successful run verifies the **provided test cases only**. It is not a correctness proof, an adversarial hidden judge or an execution of C++ code. For C++20, use the existing native Clang/WASM [C++ laboratory](cpp-lab.html). The Worker should be used with **code the student writes**, not with untrusted third-party pasted scripts. A Worker is not a hardened hostile-code isolation boundary.

## Timed rounds and evaluations

A round samples source-labelled questions for the chosen company and role. An interviewer would still need to evaluate spoken reasoning and code quality in an actual mock. Students can record reasoning, code, independent rubrics for contract, correctness, complexity, edge tests and communication, reveal follow-ups, and save/export scores. These five-dimensional scores are **self-assessed** and never claimed to be externally verified.

The spaced review queue uses an explicit rule: failed/partial outcomes are due sooner, while successful independent attempts are scheduled with increasing intervals (one, three, seven, fourteen, thirty or more days). Verified code outcomes are tracked separately from self-ratings. None of this is a placement prediction, pass guarantee or institutionally accredited certification.

## Deliberate limitations and next improvements

- No private/proprietary interview bank or scraped paywalled statements.
- External official problem links may later move or require a LeetCode account. We did not live-verify every linked LeetCode page.
- Browser-local progress only: no logins, shared scores or cloud sync.
- For most 284 linked problems, solve on the original source or in your local IDE; only ten patterns have in-page executable autograding.
- Next improvements: more validated runnable problems, human interviewer feedback, C++-specific tests, multi-stage mock rotations, and statistically grounded readiness calibration.