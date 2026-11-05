/* Mastery Interview Academy — independently written practice briefs with exact public attribution. */
const MASTERY_INTERVIEW_QUESTIONS=Object.freeze([
  {
    "id": "js-memo",
    "company": "Jane Street",
    "role": "SWE",
    "title": "Memo: from memoization to bounded caching",
    "evidence": "official",
    "evidenceText": "An employer-published, retired or sample interview task.",
    "difficulty": "Hard",
    "minutes": 45,
    "topic": "Design & coding",
    "prompt": "Jane Street publicly describes a retired interview task called Memo. Start by wrapping a deterministic expensive function so each distinct input is computed once. Then bound memory, design constant-time eviction, and explain behaviour under concurrency. Write executable code in a language you know well. Use the official article for the exact retired prompt; this page gives an independently worded practice brief.",
    "source": "Jane Street engineering blog, retired question (2017)",
    "link": "https://blog.janestreet.com/what-a-jane-street-dev-interview-is-like/",
    "reference": "https://blog.janestreet.com/what-a-jane-street-dev-interview-is-like/",
    "concepts": [
      "Memoization: storing results of a deterministic function so later calls reuse the value.",
      "Eviction policy: rule choosing which cached entry to discard when at capacity.",
      "Hash map: key/value structure supporting expected constant-time lookup."
    ],
    "followups": [
      "How does FIFO behave against repeated hot keys?",
      "Make this cache correct if two callers compute the same uncached key concurrently.",
      "What changes if the expensive function is nondeterministic?"
    ],
    "solution": "Begin with a map keyed by input. For bounded size, pair a map with a FIFO queue or with an LRU doubly linked list (for true recency). Carefully state whether zero capacity bypasses caching. Concurrency needs an in-flight-entry state and synchronization; computing outside a lock without coordination can duplicate work. Walk through a miss, hit, eviction and exception.",
    "focus": [
      "contract clarification",
      "correct code",
      "invariants",
      "complexity",
      "collaborative tradeoffs"
    ]
  },
  {
    "id": "js-trading-sample",
    "company": "Jane Street",
    "role": "Quant Trading",
    "title": "Official trading mock: structured probability dialogue",
    "evidence": "official",
    "evidenceText": "An employer-published, retired or sample interview task.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Probability & communication",
    "prompt": "Jane Street publishes a sample trading interview video. Open the official recording and work through its successive question stages without viewing the candidate explanation first. Then reconstruct every probability or expectation argument aloud. This is a linked official mock, not a copied transcript.",
    "source": "Jane Street official trading interview mock",
    "link": "https://www.janestreet.com/trading-interviews/",
    "reference": "https://www.janestreet.com/trading-interviews/",
    "concepts": [
      "Expected value: probability-weighted average payoff.",
      "Conditional probability: probability after restricting to observed information."
    ],
    "followups": [
      "What changed between the stages?",
      "Explain your answer without algebra first.",
      "Stress-test your assumptions."
    ],
    "solution": "A strong response states the sample space, clarifies the event, conditions correctly and shows a sanity check. Compare your solution with the official recording only after attempting it. Jane Street explicitly values conversation and course correction.",
    "focus": [
      "sample space",
      "conditional reasoning",
      "numerical correctness",
      "spoken clarity",
      "adaptability"
    ]
  },
  {
    "id": "js-card-deck",
    "company": "Jane Street",
    "role": "Quant Trading",
    "title": "Probability deck: original conditional-draw drill",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Medium",
    "minutes": 25,
    "topic": "Conditional probability",
    "prompt": "An urn contains 5 red and 3 blue tokens. Draw two without replacement. After learning that at least one drawn token is red, compute the probability both are red. Then repeat given that the FIRST token is red. Compare the conditioning events and justify every denominator.",
    "source": "Original Mastery drill using themes from Jane Street’s official probability-playing-card resource",
    "link": "https://www.janestreet.com/probability-playing-cards/",
    "reference": "https://www.janestreet.com/probability-playing-cards/",
    "concepts": [
      "Conditional probability: P(A|B)=P(A∩B)/P(B).",
      "Without replacement: the population changes after each draw."
    ],
    "followups": [
      "How does the result change for r red and b blue?",
      "Explain why at-least-one and first-is are not equivalent."
    ],
    "solution": "P(both red | at least one red) = C(5,2)/(C(8,2)-C(3,2))=10/25=2/5. Given first red, P(second red)=4/7. The observations define different denominators.",
    "focus": [
      "clear events",
      "correct combinatorics",
      "conditioning",
      "generalization",
      "spoken explanation"
    ]
  },
  {
    "id": "cit-rpn",
    "company": "Citadel",
    "role": "SWE",
    "title": "Evaluate Reverse Polish Notation",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Stack",
    "prompt": "Evaluate a postfix expression containing signed integer tokens and basic binary arithmetic. Define division rounding for negative inputs and reject malformed expressions.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/2.%20Three%20Months.csv",
    "reference": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "concepts": [
      "Stack: last-in-first-out collection; push and pop are constant-time.",
      "Postfix: each operator follows its operands."
    ],
    "followups": [
      "What inputs cause stack underflow?",
      "Explain division semantics and overflow handling."
    ],
    "solution": "Push numbers; on each operator pop right operand first, then left, compute, and push. Final stack must contain exactly one result. Time O(n), space O(n).",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "cit-backlog",
    "company": "Citadel",
    "role": "SWE",
    "title": "Number of Orders in the Backlog",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Heaps & order matching",
    "prompt": "Build a simplified two-sided order backlog with best-price matching and quantities. Explain why price priority alone is not enough to reproduce a real venue.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/2.%20Three%20Months.csv",
    "reference": "https://leetcode.com/problems/number-of-orders-in-the-backlog/",
    "concepts": [
      "Heap: priority queue returning the highest/lowest-priority element efficiently.",
      "Partial fill: only a portion of an order quantity is executed."
    ],
    "followups": [
      "Add FIFO within price levels.",
      "Support cancellations by order ID."
    ],
    "solution": "Use a max heap of bids and min heap of asks for best price; process crossings and decrement quantities. The canonical LeetCode problem does not require full venue-grade order ID cancellation or FIFO; those require explicit data structures.",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "cit-timekv",
    "company": "Citadel",
    "role": "SWE",
    "title": "Time Based Key-Value Store",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Binary search & design",
    "prompt": "Implement put(key,value,time) and get(key,time), returning the latest value written no later than the query time. State whether timestamps are sorted.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/2.%20Three%20Months.csv",
    "reference": "https://leetcode.com/problems/time-based-key-value-store/",
    "concepts": [
      "Upper bound: first position strictly greater than the query.",
      "Predecessor: nearest stored timestamp no greater than the query."
    ],
    "followups": [
      "What if timestamps arrive out of order?",
      "Explain inclusive time boundaries."
    ],
    "solution": "Store sorted timestamp-value arrays per key. Binary search for last timestamp <= query; with ordered inserts, get is O(log n), append put amortized O(1). Unordered insertion changes complexity.",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "cit-randset",
    "company": "Citadel",
    "role": "SWE",
    "title": "Insert Delete GetRandom O(1)",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Hashing & randomization",
    "prompt": "Design a collection supporting insert, delete, and uniform random selection in expected O(1) time. Explain how deletion avoids a linear shift.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/2.%20Three%20Months.csv",
    "reference": "https://leetcode.com/problems/insert-delete-getrandom-o1/",
    "concepts": [
      "Hash map: key to index mapping.",
      "Swap-with-last: O(1) removal from unordered vector."
    ],
    "followups": [
      "What happens for an empty set?",
      "Why is modulo-based random selection potentially biased?"
    ],
    "solution": "Keep a dense vector and hash map value→index. For erase, move the last vector element into the removed slot, update its index, pop_back. Uniform selection uses a proper bounded distribution.",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "cit-topo",
    "company": "Citadel",
    "role": "SWE",
    "title": "Course Schedule II",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Graphs",
    "prompt": "Given dependencies, return a legal ordering or report that a directed cycle prevents one. Compare DFS colors and indegree queues.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/2.%20Three%20Months.csv",
    "reference": "https://leetcode.com/problems/course-schedule-ii/",
    "concepts": [
      "DAG: directed acyclic graph.",
      "Topological order: linear ordering with every dependency before its dependent."
    ],
    "followups": [
      "Show a minimal cycle counterexample.",
      "Handle disconnected graph components."
    ],
    "solution": "Kahn’s algorithm builds indegrees, enqueues zero-indegree vertices, and removes their outgoing edges. If result has fewer than n nodes, a cycle exists. O(V+E).",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "cit-swmax",
    "company": "Citadel",
    "role": "SWE",
    "title": "Sliding Window Maximum",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Hard",
    "minutes": 35,
    "topic": "Monotonic deque",
    "prompt": "For every window of width k in an integer stream, emit the maximum in amortized O(1) per element. Prove why discarded candidates never become useful again.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/5.%20All.csv",
    "reference": "https://leetcode.com/problems/sliding-window-maximum/",
    "concepts": [
      "Deque: double-ended queue.",
      "Monotonic deque: indices ordered by decreasing values."
    ],
    "followups": [
      "What happens with duplicate values?",
      "Explain amortized O(n) rather than worst-case per operation."
    ],
    "solution": "Maintain indices with decreasing values; expire indices outside the window, remove smaller trailing values, and read the maximum at the head. Each index enters and exits at most once.",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "cit-median",
    "company": "Citadel",
    "role": "SWE",
    "title": "Find Median from Data Stream",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Hard",
    "minutes": 35,
    "topic": "Heaps",
    "prompt": "Maintain the median while accepting numbers one by one, without sorting the entire prefix each time. Derive your heap balance invariant.",
    "source": "Public LeetCode Citadel-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Citadel/5.%20All.csv",
    "reference": "https://leetcode.com/problems/find-median-from-data-stream/",
    "concepts": [
      "Max-heap: returns largest element.",
      "Median: middle order statistic, or mean of the two middle elements."
    ],
    "followups": [
      "Handle negative numbers and int overflow for averaging.",
      "Compare two heaps to a balanced search tree."
    ],
    "solution": "Use max heap lower half and min heap upper half. Enforce size difference at most one and max(lower)<=min(upper). Insert O(log n), median O(1).",
    "focus": [
      "clarify constraints",
      "working implementation",
      "invariant proof",
      "edge cases",
      "complexity"
    ]
  },
  {
    "id": "meta-3sum",
    "company": "Meta",
    "role": "SWE",
    "title": "3Sum",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 35,
    "topic": "Two pointers",
    "prompt": "Find unique three-element combinations meeting a target sum. Explain why sorting makes duplicates manageable.",
    "source": "Public LeetCode Meta-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Meta/1.%20Thirty%20Days.csv",
    "reference": "https://leetcode.com/problems/3sum/",
    "concepts": [
      "Two pointers: two indices moving according to an invariant.",
      "Duplicate suppression: avoid generating the same value triple more than once."
    ],
    "followups": [
      "What if the target is not zero?",
      "Prove why moving the smaller side cannot miss a solution."
    ],
    "solution": "Sort, fix one value, and sweep the remaining interval with two pointers. Skip repeated fixed and candidate values. O(n²) time excluding output; O(1) auxiliary for the scan.",
    "focus": [
      "problem framing",
      "correct code",
      "data structure invariant",
      "edge cases",
      "communication"
    ]
  },
  {
    "id": "meta-valid",
    "company": "Meta",
    "role": "SWE",
    "title": "Valid Parentheses",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Easy",
    "minutes": 35,
    "topic": "Stacks",
    "prompt": "Validate nesting across several kinds of bracket characters. Explain why counting only opening and closing tokens is insufficient.",
    "source": "Public LeetCode Meta-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Meta/1.%20Thirty%20Days.csv",
    "reference": "https://leetcode.com/problems/valid-parentheses/",
    "concepts": [
      "Stack: most recent unclosed delimiter first.",
      "Nesting invariant: the most recently opened bracket must close next."
    ],
    "followups": [
      "What happens on an unexpected closing delimiter?",
      "State empty input semantics."
    ],
    "solution": "Push opening brackets; for closing brackets require a matching top element. Correct if and only if no mismatch and stack is empty at end. O(n) time and space.",
    "focus": [
      "problem framing",
      "correct code",
      "data structure invariant",
      "edge cases",
      "communication"
    ]
  },
  {
    "id": "meta-merge",
    "company": "Meta",
    "role": "SWE",
    "title": "Merge Two Sorted Lists",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Easy",
    "minutes": 35,
    "topic": "Linked lists",
    "prompt": "Merge two ascending singly linked lists by relinking nodes, not copying values. Explain the null and aliasing preconditions.",
    "source": "Public LeetCode Meta-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Meta/1.%20Thirty%20Days.csv",
    "reference": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "concepts": [
      "Singly linked list: chain of nodes with next pointers.",
      "Dummy node: temporary sentinel simplifying head updates."
    ],
    "followups": [
      "Can the input lists share a node?",
      "Show the loop invariant."
    ],
    "solution": "Use a dummy node and tail pointer, repeatedly take the lower current node, then append the remaining chain. O(n+m) time, O(1) extra space if nodes are not aliased.",
    "focus": [
      "problem framing",
      "correct code",
      "data structure invariant",
      "edge cases",
      "communication"
    ]
  },
  {
    "id": "meta-median2",
    "company": "Meta",
    "role": "SWE",
    "title": "Median of Two Sorted Arrays",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Hard",
    "minutes": 35,
    "topic": "Binary search",
    "prompt": "Compute the median of two individually sorted arrays without fully merging them. Derive the partition inequalities.",
    "source": "Public LeetCode Meta-tag snapshot (2025)",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems/blob/main/Meta/1.%20Thirty%20Days.csv",
    "reference": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "concepts": [
      "Partition: divide values into left/right halves.",
      "Order statistic: element at a particular rank."
    ],
    "followups": [
      "How do you handle an empty input array?",
      "Bound arithmetic overflow on average."
    ],
    "solution": "Binary-search the partition in the shorter array; choose i,j so left sizes are balanced and max(leftA,leftB)<=min(rightA,rightB). O(log min(m,n)).",
    "focus": [
      "problem framing",
      "correct code",
      "data structure invariant",
      "edge cases",
      "communication"
    ]
  },
  {
    "id": "goog-eval",
    "company": "Google",
    "role": "SWE",
    "title": "Evaluate Division",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 40,
    "topic": "Graphs & DSU",
    "prompt": "Given known pairwise multiplicative ratios, infer missing ratios while respecting disconnected components and inconsistent information.",
    "source": "Public company-tagged open-source GitHub list (historical)",
    "link": "https://github.com/Faizi-alpha/LeetCode-CompanyWise-Problems",
    "reference": "https://leetcode.com/problems/evaluate-division/",
    "concepts": [
      "Weighted graph: edges with numeric conversion factors.",
      "Connected component: set of nodes linked by paths."
    ],
    "followups": [
      "How do zero and inconsistent equations affect the model?",
      "Compare weighted union-find with graph BFS."
    ],
    "solution": "Create directed edges with ratio w and reverse edges 1/w (nonzero ratios). BFS/DFS multiplying along a path; avoid assuming answers exist between disconnected components. Complexity per query O(V+E) without preprocessing.",
    "focus": [
      "correctness",
      "efficiency",
      "reasoning about constraints",
      "testing",
      "extensions"
    ]
  },
  {
    "id": "goog-stones",
    "company": "Google",
    "role": "SWE",
    "title": "Most Stones Removed with Same Row or Column",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Medium",
    "minutes": 40,
    "topic": "Union-Find",
    "prompt": "Connect positions sharing a row or column. Prove the maximum removable count from connected-component structure.",
    "source": "Public company-tagged open-source GitHub list (historical)",
    "link": "https://github.com/Faizi-alpha/LeetCode-CompanyWise-Problems",
    "reference": "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
    "concepts": [
      "Disjoint-set union: structure maintaining connected components.",
      "Component: a group connected through adjacency."
    ],
    "followups": [
      "How do you compress arbitrary row and column IDs?",
      "Explain path compression amortized complexity."
    ],
    "solution": "Each connected component can retain one stone and remove all others, so result = number of stones – number of components. DSU handles row/column connectivity.",
    "focus": [
      "correctness",
      "efficiency",
      "reasoning about constraints",
      "testing",
      "extensions"
    ]
  },
  {
    "id": "goog-split",
    "company": "Google",
    "role": "SWE",
    "title": "Split Array Largest Sum",
    "evidence": "company-tags",
    "evidenceText": "This is a public community company tag, not an employer-confirmed interview question.",
    "difficulty": "Hard",
    "minutes": 40,
    "topic": "Binary search on answer",
    "prompt": "Divide nonnegative numbers into at most k contiguous groups minimizing the largest group sum. Justify monotonic feasibility.",
    "source": "Public company-tagged open-source GitHub list (historical)",
    "link": "https://github.com/Faizi-alpha/LeetCode-CompanyWise-Problems",
    "reference": "https://leetcode.com/problems/split-array-largest-sum/",
    "concepts": [
      "Decision problem: whether a candidate threshold is feasible.",
      "Monotone predicate: once threshold becomes feasible, all larger thresholds are feasible."
    ],
    "followups": [
      "Why does greedy feasibility fail with negative numbers?",
      "Provide tight lower and upper search bounds."
    ],
    "solution": "Binary search threshold between max(a) and sum(a); greedily start a new segment when adding the next element exceeds threshold. Feasibility is monotone for nonnegative data. O(n log sum).",
    "focus": [
      "correctness",
      "efficiency",
      "reasoning about constraints",
      "testing",
      "extensions"
    ]
  },
  {
    "id": "amz-queue",
    "company": "Amazon",
    "role": "SWE",
    "title": "Build a capacity-limited task dispatcher",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Medium",
    "minutes": 40,
    "topic": "Queues",
    "prompt": "Implement a bounded job queue with enqueue/dequeue, FIFO order, explicit full/empty responses, and no silent drops. Then design worker retries without executing the same job twice.",
    "source": "Amazon official SDE interview preparation (topic guidance)",
    "link": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
    "reference": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
    "concepts": [
      "Bounded queue: queue with a fixed maximum capacity.",
      "Idempotency: repeated request has the same durable effect as one execution."
    ],
    "followups": [
      "How will you recover after a worker crash?",
      "Which state transitions require durable persistence?"
    ],
    "solution": "Implement ring indices for a fixed-size queue, track occupied count, and distinguish full/empty. For distributed worker retries, use durable job IDs and acknowledgements; mere in-memory queue logic cannot ensure exactly once.",
    "focus": [
      "scope and tradeoffs",
      "algorithm or architecture",
      "edge cases",
      "testing strategy",
      "communication"
    ]
  },
  {
    "id": "amz-stream",
    "company": "Amazon",
    "role": "SWE",
    "title": "Design clickstream event ingestion",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Hard",
    "minutes": 40,
    "topic": "System design",
    "prompt": "Design an API and pipeline that ingests 50,000 events/second, tolerates duplicates, and produces minute aggregates. State consistency and freshness objectives before drawing components.",
    "source": "Amazon official SDE interview preparation (topic guidance)",
    "link": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
    "reference": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
    "concepts": [
      "At-least-once delivery: messages may repeat but should not be lost.",
      "Watermark: boundary for how late events are handled."
    ],
    "followups": [
      "What if an event arrives 20 minutes late?",
      "How do you partition a hot customer?"
    ],
    "solution": "Use partitioned durable ingestion, immutable event IDs, keyed idempotent aggregation/windowing, checkpointed processing offsets and explicit late-event policy. Quantify throughput and delivery semantics.",
    "focus": [
      "scope and tradeoffs",
      "algorithm or architecture",
      "edge cases",
      "testing strategy",
      "communication"
    ]
  },
  {
    "id": "amz-lru",
    "company": "Amazon",
    "role": "SWE",
    "title": "Cache with expiry and memory budget",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Medium",
    "minutes": 40,
    "topic": "Data structures",
    "prompt": "Design a local cache supporting get/put with TTL and an upper memory budget. Choose eviction and explain stale reads and expiry races.",
    "source": "Amazon official SDE interview preparation (topic guidance)",
    "link": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
    "reference": "https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics",
    "concepts": [
      "TTL: time-to-live deadline after which an entry is invalid.",
      "LRU: least recently used eviction policy."
    ],
    "followups": [
      "What if wall time moves backwards?",
      "Show how a cache stampede happens."
    ],
    "solution": "Use hash map with list for O(1) expected LRU operations, expiry timestamps from a monotonic clock and capacity accounting. Expired entries are treated as misses; bounding memory needs accurate object sizes.",
    "focus": [
      "scope and tradeoffs",
      "algorithm or architecture",
      "edge cases",
      "testing strategy",
      "communication"
    ]
  },
  {
    "id": "apple-array",
    "company": "Apple",
    "role": "SWE",
    "title": "Memory-aware image tile processing",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Hard",
    "minutes": 40,
    "topic": "Systems coding",
    "prompt": "Design a tile-processing pipeline for a large image buffer, minimizing allocations and data copies while handling rectangular dimensions and strides.",
    "source": "Original Mastery scenario; source supports topic/format, not exact historical question",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems",
    "reference": "https://github.com/liquidslr/leetcode-company-wise-problems",
    "concepts": [
      "Stride: number of memory elements between adjacent rows.",
      "Cache locality: consecutive memory access tends to cost less."
    ],
    "followups": [
      "What happens when input and output alias?",
      "How do you test off-by-one row boundaries?"
    ],
    "solution": "Represent input/output spans with explicit dimensions, validate multiplication overflow, operate tilewise, and benchmark only after verifying correctness.",
    "focus": [
      "mathematical or systems contract",
      "correctness",
      "assumptions",
      "counterexamples",
      "collaborative explanation"
    ]
  },
  {
    "id": "nflx-stream",
    "company": "Netflix",
    "role": "SWE",
    "title": "Video-playback session telemetry",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Hard",
    "minutes": 40,
    "topic": "Distributed systems",
    "prompt": "Design session-event collection under retries, late arrivals and duplicate delivery. Define what the dashboard promises, then handle a failed regional consumer.",
    "source": "Original Mastery scenario; source supports topic/format, not exact historical question",
    "link": "https://github.com/liquidslr/leetcode-company-wise-problems",
    "reference": "https://github.com/liquidslr/leetcode-company-wise-problems",
    "concepts": [
      "Eventual consistency: replicas may temporarily disagree.",
      "Idempotent consumer: safe replay of the same event."
    ],
    "followups": [
      "How would you handle offline devices?",
      "What is the partition key?"
    ],
    "solution": "Use client event UUID, durable partitioned log, idempotent aggregation, retention and replay limits; separate live estimates from reconciled totals.",
    "focus": [
      "mathematical or systems contract",
      "correctness",
      "assumptions",
      "counterexamples",
      "collaborative explanation"
    ]
  },
  {
    "id": "hrt-mdata",
    "company": "Hudson River Trading",
    "role": "Quant Dev",
    "title": "Loss-aware market-data fanout",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Hard",
    "minutes": 40,
    "topic": "Low latency",
    "prompt": "Design a publisher with per-subscriber cursors and bounded memory. Fast subscribers must make progress when one reader falls behind. Specify gap detection and state resynchronization.",
    "source": "Original Mastery scenario; source supports topic/format, not exact historical question",
    "link": "https://github.com/perixtar/quant-interview-oa-bank",
    "reference": "https://github.com/perixtar/quant-interview-oa-bank",
    "concepts": [
      "Sequence gap: missing event in an ordered stream.",
      "Backpressure: mechanism that prevents unbounded producer/consumer imbalance."
    ],
    "followups": [
      "What state must a snapshot cover?",
      "Explain exactly why bounded memory implies loss or backpressure."
    ],
    "solution": "Maintain immutable sequenced ring retention and per-consumer offsets, flag lag beyond retention, require a snapshot handshake and replay from the validated boundary.",
    "focus": [
      "mathematical or systems contract",
      "correctness",
      "assumptions",
      "counterexamples",
      "collaborative explanation"
    ]
  },
  {
    "id": "cit-quant",
    "company": "Citadel",
    "role": "Quant Trading",
    "title": "Expected-value price of a risky quote",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Medium",
    "minutes": 40,
    "topic": "Probability & markets",
    "prompt": "An asset pays 20 with probability 0.35 and 80 otherwise. Find the fair value, then define a bid and ask after adding a risk buffer. Show how the quote changes if you hold a large long inventory.",
    "source": "Original Mastery scenario; source supports topic/format, not exact historical question",
    "link": "https://www.citadelsecurities.com/careers/career-perspectives/our-quantitative-research-interview-process/",
    "reference": "https://www.citadelsecurities.com/careers/career-perspectives/our-quantitative-research-interview-process/",
    "concepts": [
      "Fair value: expected payoff under the assumed probability measure.",
      "Inventory skew: price adjustment reflecting current risk exposure."
    ],
    "followups": [
      "What if probabilities are uncertain?",
      "How does adverse selection change the calculation?"
    ],
    "solution": "Expectation is 20(0.35)+80(0.65)=59. A risk-neutral mid is 59; bid/ask require assumptions about spread, costs, fill probabilities and risk. Long inventory generally shifts reservation value lower.",
    "focus": [
      "mathematical or systems contract",
      "correctness",
      "assumptions",
      "counterexamples",
      "collaborative explanation"
    ]
  },
  {
    "id": "js-dice",
    "company": "Jane Street",
    "role": "Quant Trading",
    "title": "Stopping-time pattern probability",
    "evidence": "practice",
    "evidenceText": "An original Mastery exercise modeled on publicly described interview competencies.",
    "difficulty": "Hard",
    "minutes": 40,
    "topic": "Probability",
    "prompt": "Flip a fair coin until HT appears. Derive expected waiting time using first-step equations, then compare with HH. Prove the result and check overlap effects.",
    "source": "Original Mastery scenario; source supports topic/format, not exact historical question",
    "link": "https://www.janestreet.com/probability-markets/",
    "reference": "https://www.janestreet.com/probability-markets/",
    "concepts": [
      "Stopping time: first time a specified event is observed.",
      "State recurrence: equation for the expected remaining time from each partial-match state."
    ],
    "followups": [
      "How does an unfair coin change the answer?",
      "Explain why naive reciprocal probability fails."
    ],
    "solution": "HT has expected waiting time 4; HH has 6. Build separate states for no useful suffix and suffix H. HT equations lead E0=4; for HH an H can self-overlap, leading E0=6.",
    "focus": [
      "mathematical or systems contract",
      "correctness",
      "assumptions",
      "counterexamples",
      "collaborative explanation"
    ]
  }
]);