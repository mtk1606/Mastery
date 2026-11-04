# Programming Laboratories — verified QA

Date: 2026-11-04

## Browser tests

33 / 33 checks passed in Chromium using a test-only inlined version of the static site (local HTTP navigation blocked in this environment). The actual JavaScript solutions executed in Web Workers created from the same worker source as `labs-worker.js`.

- 8 available browser algorithm/system-design laboratories
- 56 / 56 deterministic reference test cases passed, including stress inputs, edge cases and pointer-node identity checks
- Incorrect pair indices rejected
- Syntax errors surfaced clearly
- Infinite loops terminated after the 6-second watchdog
- Editor, results, notes and progress backup round-trip verified with an actual download and restored JSON file
- Deliberately buggy implementation was caught by the same real unit tests
- Light/Dark theme toggles and narrow mobile layout verified
- 3 C++20 native projects listed; header file loaded through a test-only fetch stub

**Limit**: browser QA did not use real GitHub Pages network loading; deployment checks are separate. Test cases are deterministic, and browser timing numbers are not comparable to native performance experiments. The 8 intentionally buggy implementations are teaching exercises; not an exhaustive security assessment.

## Native reference C++ tests

- GCC C++20, Debug configuration: 3/3 passed
- GCC C++20, Release configuration: 3/3 passed
- GCC C++20, Debug + AddressSanitizer / UndefinedBehaviorSanitizer: 3/3 passed
- Student TODO builds: 3/3 intentionally fail until implemented, as expected
- C++ benchmark executable generated mean, p50, p95, p99 observed timings; these are not claims of production or exchange latency

## Execution limits

Browser JavaScript runs locally inside a disposable Worker. It is not security-isolated like a server-side container. C++ compilation requires the user's local C++20 toolchain, or an external optional WASM compiler with reduced capabilities. We do not claim C++ currently compiles directly inside Mastery's GitHub Pages site.

The QA does not attest that every educational proof was peer-reviewed or every performance result replicates on other hardware.
## Continuous integration and deployment

GitHub Actions workflow `.github/workflows/labs-ci.yml` passed the Node 22 reference test suite and native C++20 CTest jobs. GitHub Pages successfully deployed the programming lab files on November 4, 2026. Reference tests on the uploaded source passed; this is not a claim of verified browser-hosted native C++ execution.
