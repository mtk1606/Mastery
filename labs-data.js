/* Mastery / Programming Laboratories: original executable course problems.
 * Users' scripts execute only in a dedicated disposable Worker; no remote judge.
 */
'use strict';
const LABS = [
 {id:'two-sum',course:'Algorithms',week:'01',title:'Hashing and pair existence',time:'35–50 minutes',concepts:[['Hash map','A table mapping each stored key to a value. Average expected lookup O(1), not worst-case guaranteed.'],['Complement','The value target − x required to complete a pair.'],['Invariant','A claim maintained before and after every loop iteration.']],objective:'Return two distinct indices whose values sum to the target, or an empty array if no pair exists.',interface:'function solve({nums, target}) → [i, j] or []',invariant:'Before processing index i, the map contains exactly the values at earlier indices. Query before insertion to avoid reusing the same element.',reason:'A valid pair (j, i), with j < i, must be found when i is processed because nums[j] is already stored.',failure:'Input [3,3], target 6: using the current element as its own complement is incorrect.',complexity:'Aim for expected O(n) time and O(n) additional space. The naive two-loop solution is O(n²).',starter:`function solve({nums, target}) {
  // Stage 1: implement any correct solution.
  // Stage 2: replace the nested loops with a Map.
  // Stage 3: explain why the two indices must differ.
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,reference:`function solve({nums, target}) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,inputType:'object',validator:'pair',tests:[
  {tier:'sample',name:'basic complement',input:{nums:[2,7,11,15],target:9},expected:true},
  {tier:'sample',name:'duplicate value',input:{nums:[3,3],target:6},expected:true},
  {tier:'core',name:'no solution',input:{nums:[1,2,4],target:9},expected:false},
  {tier:'core',name:'negative values',input:{nums:[-6,1,12],target:6},expected:true},
  {tier:'core',name:'zero',input:{nums:[0,9],target:9},expected:true},
  {tier:'edge',name:'single element',input:{nums:[5],target:10},expected:false},
  {tier:'edge',name:'multiple valid pairs',input:{nums:[1,2,3,4],target:5},expected:true},
  {tier:'edge',name:'empty input',input:{nums:[],target:0},expected:false},
  {tier:'stress',name:'long unique range',input:{nums:Array.from({length:7000},(_,i)=>i+100000),target:0},expected:false}
 ],tasks:['Explain the difference between Map.has and Map.get for a stored index 0.','Give a loop invariant and show initialization, maintenance, termination.','Construct an adversarial input for the quadratic version.'],hint:['Use target − nums[i] to ask a yes/no question.','Query earlier values before storing the current number.']},
 {id:'window',course:'Algorithms',week:'02',title:'Sliding windows and maintained state',time:'40–55 minutes',concepts:[['Window','A contiguous segment of an array represented by two indices.'],['Fixed-length invariant','The sum is exactly over the k positions in the current window.'],['Amortized analysis','Charge each element entering and leaving the window at most once.']],objective:'Find the maximum sum of any contiguous subarray of exactly k elements. Return null if k is invalid.',interface:'function solve({nums, k}) → number | null',invariant:'After updating right endpoint r, the sum equals the elements in [r−k+1, r] when r≥k−1.',reason:'Each update adds one new item and removes one expired item, giving O(1) work per shift.',failure:'Initializing best to 0 fails when all values are negative.',complexity:'O(n) time; O(1) additional memory.',starter:`function solve({nums, k}) {
  if (k < 1 || k > nums.length) return null;
  // TODO: maintain a running sum as the window moves.
  let best = -Infinity;
  for (let i = 0; i + k <= nums.length; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) sum += nums[j];
    best = Math.max(best, sum);
  }
  return best;
}`,reference:`function solve({nums, k}) {
  if (!Number.isInteger(k) || k < 1 || k > nums.length) return null;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    if (sum > best) best = sum;
  }
  return best;
}`,tests:[
  {tier:'sample',name:'basic window',input:{nums:[2,-1,5,-2,3],k:3},expected:6},
  {tier:'sample',name:'one element',input:{nums:[5,-1,3],k:1},expected:5},
  {tier:'core',name:'all negative',input:{nums:[-5,-2,-7],k:2},expected:-7},
  {tier:'core',name:'whole array',input:{nums:[5,1,9],k:3},expected:15},
  {tier:'edge',name:'empty array',input:{nums:[],k:1},expected:null},
  {tier:'edge',name:'invalid k zero',input:{nums:[3,4],k:0},expected:null},
  {tier:'edge',name:'invalid k too large',input:{nums:[3],k:2},expected:null},
  {tier:'stress',name:'large input',input:{nums:Array.from({length:12000},(_,i)=>i%7-3),k:100},expected:5}
 ],tasks:['Prove that the rolling sum is always the sum of exactly k elements.','Find why max=0 is a wrong initialization.','Derive the O(n) time bound.'],hint:['Keep a single sum and subtract what exits.','Initialize best only after the first full window.']},
 {id:'lower-bound',course:'Algorithms',week:'03',title:'Binary search as a proof',time:'40–55 minutes',concepts:[['Lower bound','First index i for which nums[i] ≥ target, or n if no such index exists.'],['Half-open interval','[lo,hi) includes lo but excludes hi.'],['Monotone predicate','Once the predicate becomes true, it stays true.']],objective:'Return the insertion index of target into an ascending sorted array, choosing the first equal position.',interface:'function solve({nums,target}) → integer index',invariant:'All positions <lo fail nums[i]≥target; all positions ≥hi succeed. The answer stays in [lo,hi].',reason:'Every iteration shrinks the candidate interval and preserves the boundary invariant.',failure:'Using hi=n−1 with [lo,hi) rules causes off-by-one errors.',complexity:'O(log n) time, O(1) space.',starter:`function solve({nums, target}) {
  // Replace linear scanning with lower-bound binary search.
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) return i;
  }
  return nums.length;
}`,reference:`function solve({nums, target}) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,tests:[
  {tier:'sample',name:'present',input:{nums:[1,3,5,7],target:5},expected:2},
  {tier:'sample',name:'absent',input:{nums:[1,3,5,7],target:4},expected:2},
  {tier:'core',name:'duplicates',input:{nums:[1,2,2,2,7],target:2},expected:1},
  {tier:'core',name:'beyond right end',input:{nums:[1,2,4],target:8},expected:3},
  {tier:'edge',name:'before left end',input:{nums:[4,5],target:1},expected:0},
  {tier:'edge',name:'empty',input:{nums:[],target:1},expected:0},
  {tier:'stress',name:'large ascending array',input:{nums:Array.from({length:120000},(_,i)=>i*2),target:195001},expected:97501}
 ],tasks:['State your exact invariant for the half-open interval.','Explain why a duplicate cannot be skipped.','Prove logarithmic iterations.'],hint:['The answer is in [lo,hi].','Use mid<target to discard mid inclusively; otherwise retain mid.']},
 {id:'reverse-list',course:'Algorithms',week:'04',title:'Linked lists and pointer invariants',time:'50–70 minutes',concepts:[['Node','An object containing a value (val) and a reference (next).'],['Head pointer','Reference to the first node; null if the list is empty.'],['Aliasing','Two references pointing to the same object.'],['Mutation','Changing existing node links rather than allocating new ones.']],objective:'Reverse a singly linked list in place and return its new head. You must reuse all original nodes; allocating replacement nodes fails identity checks.',interface:'function solve(head) → new head',invariant:'prev heads the completely reversed processed prefix; curr heads the unprocessed suffix. Together they cover every original node exactly once.',reason:'Save next before mutation; reverse one link; advance prev and curr. Each node moves from unprocessed to processed exactly once.',failure:'Setting curr.next=prev before saving its original next loses the remainder of the list.',complexity:'O(n) time, O(1) auxiliary memory.',starter:`function solve(head) {
  // head is {val, next} or null. Reverse links in place.
  // Keep next before you overwrite curr.next.
  let prev = null;
  let curr = head;
  // TODO: while (curr) ...
  return prev;
}`,reference:`function solve(head) {
  let prev = null, curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,validator:'linked',tests:[
  {tier:'sample',name:'three nodes',input:[1,2,3],expected:[3,2,1]},
  {tier:'sample',name:'one node',input:[7],expected:[7]},
  {tier:'core',name:'four nodes',input:[2,2,3,4],expected:[4,3,2,2]},
  {tier:'edge',name:'empty',input:[],expected:[]},
  {tier:'edge',name:'two identical values',input:[5,5],expected:[5,5]},
  {tier:'stress',name:'thousand nodes',input:Array.from({length:1000},(_,i)=>i),expected:Array.from({length:1000},(_,i)=>999-i)}
 ],tasks:['Sketch the heap nodes before and after each pointer update.','Why must the original next pointer be saved before rewiring?','Give initialization, preservation and termination of the invariant.'],hint:['Maintain prev, curr and next.','You must not allocate new nodes: return the original tail.']},
 {id:'valid-brackets',course:'Algorithms',week:'05',title:'Stacks and matching invariants',time:'30–45 minutes',concepts:[['Stack','Last-in-first-out container; push adds, pop removes the most recent item.'],['Delimiter','A character such as (, [ or { whose matching partner closes a nested region.'],['Prefix invariant','After reading a prefix, the stack stores its unmatched openers in order.']],objective:'Return whether a string made from (), [] and {} is well-nested.',interface:'function solve(s) → boolean',invariant:'Stack equals exactly the sequence of unmatched open brackets from the processed prefix.',reason:'Every valid closer must match the most recently unmatched opener.',failure:'Counting open and closed brackets alone accepts "([)]" though it is invalid.',complexity:'O(n) time and O(n) worst-case stack space.',starter:`function solve(s) {
  const stack = [];
  // TODO: iterate characters and match each closer.
  return stack.length === 0;
}`,reference:`function solve(s) {
  const pairs = { ')':'(', ']':'[', '}':'{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (!stack.length || stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,tests:[
  {tier:'sample',name:'simple',input:'([])',expected:true},{tier:'sample',name:'bad nesting',input:'([)]',expected:false},
  {tier:'core',name:'empty string',input:'',expected:true},{tier:'core',name:'many kinds',input:'{[()()]}',expected:true},
  {tier:'edge',name:'unmatched opener',input:'(((',expected:false},{tier:'edge',name:'unmatched closer',input:')',expected:false},
  {tier:'stress',name:'deep nesting',input:'('.repeat(20000)+')'.repeat(20000),expected:true}
 ],tasks:['State and justify the prefix invariant.','Show why bracket counts are insufficient.','Explain LIFO versus FIFO in this problem.'],hint:['Maintain an array as a stack.','The closing bracket must match the last opener.']},
 {id:'bfs',course:'Algorithms',week:'06',title:'Breadth-first search and shortest paths',time:'50–65 minutes',concepts:[['Graph','A set of vertices connected by edges.'],['Queue','First-in-first-out structure; BFS explores earlier discoveries first.'],['Distance layer','All nodes at the same number of edges from the source.'],['Unweighted shortest path','A path minimizing the number of edges rather than weighted cost.']],objective:'Return minimum number of edges from source to target in an undirected unweighted graph, or −1 if unreachable.',interface:'function solve({n,edges,source,target}) → integer',invariant:'When a vertex leaves the BFS queue, no shorter path to it exists.',reason:'FIFO discovery explores distance layers in nondecreasing order.',failure:'A stack (DFS) cannot generally guarantee shortest path length.',complexity:'O(V+E) time and O(V+E) adjacency/storage.',starter:`function solve({n, edges, source, target}) {
  // TODO: build undirected adjacency; use queue and visited distances.
  return source === target ? 0 : -1;
}`,reference:`function solve({n, edges, source, target}) {
  const adj = Array.from({length:n},()=>[]);
  for(const [u,v] of edges){adj[u].push(v);adj[v].push(u);}
  const dist = Array(n).fill(-1), queue = [source];
  dist[source]=0;
  for(let front=0;front<queue.length;front++) {
    const u=queue[front];
    if(u===target) return dist[u];
    for(const v of adj[u]) if(dist[v]===-1){dist[v]=dist[u]+1;queue.push(v);}
  }
  return -1;
}`,tests:[
  {tier:'sample',name:'simple chain',input:{n:4,edges:[[0,1],[1,2],[2,3]],source:0,target:3},expected:3},
  {tier:'sample',name:'direct shortcut',input:{n:4,edges:[[0,1],[1,2],[2,3],[0,3]],source:0,target:3},expected:1},
  {tier:'core',name:'disconnected',input:{n:4,edges:[[0,1],[2,3]],source:0,target:3},expected:-1},
  {tier:'core',name:'cycles',input:{n:4,edges:[[0,1],[1,2],[2,0],[2,3]],source:0,target:3},expected:2},
  {tier:'edge',name:'same source and target',input:{n:1,edges:[],source:0,target:0},expected:0},
  {tier:'stress',name:'long line',input:{n:7000,edges:Array.from({length:6999},(_,i)=>[i,i+1]),source:0,target:6999},expected:6999}
 ],tasks:['Prove FIFO layers are explored in increasing distance.','Contrast a queue with a stack and provide a counterexample.','Give O(V+E) work accounting for the adjacency scan.'],hint:['Build adjacency lists.','Mark nodes when enqueued, not dequeued.']},
 {id:'coin-change',course:'Algorithms',week:'07',title:'Dynamic programming and optimal substructure',time:'60–80 minutes',concepts:[['State','A subproblem represented by a parameter, here remaining amount a.'],['Recurrence','A formula using smaller states to compute a new state.'],['Base case','A solved state that anchors the recurrence.'],['Sentinel','A special value Infinity marking an unreachable amount.']],objective:'For unlimited coins, return the minimum number of coins totaling amount, or −1 if impossible.',interface:'function solve({coins,amount}) → integer',invariant:'When dp[a] is finalized, it equals the best solution using amounts <a.',reason:'Any optimal solution for amount a ends in some coin c and reduces to an optimal solution for a−c.',failure:'Greedy picking largest coin first fails for coins [1,3,4], amount 6: 4+1+1 uses 3, but 3+3 uses 2.',complexity:'O(amount × number of denominations) time; O(amount) space.',starter:`function solve({coins, amount}) {
  // TODO: let dp[0]=0 and derive larger amounts.
  return amount === 0 ? 0 : -1;
}`,reference:`function solve({coins, amount}) {
  const dp = Array(amount+1).fill(Infinity);
  dp[0] = 0;
  for(let a=1;a<=amount;a++) {
    for(const c of coins) if(c<=a && dp[a-c] !== Infinity) {
      dp[a] = Math.min(dp[a],dp[a-c]+1);
    }
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}`,tests:[
  {tier:'sample',name:'standard',input:{coins:[1,2,5],amount:11},expected:3},
  {tier:'sample',name:'greedy trap',input:{coins:[1,3,4],amount:6},expected:2},
  {tier:'core',name:'impossible',input:{coins:[2],amount:3},expected:-1},
  {tier:'core',name:'zero amount',input:{coins:[2],amount:0},expected:0},
  {tier:'edge',name:'no denominations',input:{coins:[],amount:7},expected:-1},
  {tier:'edge',name:'large coin only',input:{coins:[100],amount:200},expected:2},
  {tier:'stress',name:'large amount',input:{coins:[1,7,11],amount:10000},expected:910}
 ],tasks:['Derive dp[a] from the last coin in an optimal solution.','Prove by strong induction.','Show a coin system where greedy fails.'],hint:['dp[a] = min over c≤a of 1+dp[a−c].','Use Infinity for unreachable states and return −1 only at the end.']},
 {id:'token-bucket',course:'System Design',week:'08',title:'Build and test a token-bucket limiter',time:'55–75 minutes',concepts:[['Token bucket','Finite capacity C replenished at a fixed rate r.'],['Rate limiting','Rejecting excess requests to enforce a service budget.'],['Monotonic clock','A clock measuring elapsed time without backward jumps.']],objective:'For sorted request times in seconds, return accept/reject decisions. Each request costs one token; refill between requests and cap at capacity.',interface:'function solve({capacity,rate,times}) → boolean[]',invariant:'Immediately before a request, tokens=min(C,oldTokens+(t−lastTime)×rate). A successful request decrements exactly one.',reason:'A burst can spend accumulated tokens up to C; over sustained time the average is limited by r.',failure:'Refilling without the capacity cap incorrectly allows unlimited token accumulation.',complexity:'O(n) time; O(n) output, O(1) working state.',starter:`function solve({capacity, rate, times}) {
  // TODO: implement fractional token refill and rejection.
  return times.map(()=>true);
}`,reference:`function solve({capacity, rate, times}) {
  let tokens = capacity, last = times.length ? times[0] : 0;
  const out = [];
  for(const t of times) {
    tokens=Math.min(capacity,tokens+(t-last)*rate);
    if(tokens+1e-10>=1){out.push(true);tokens=Math.max(0,tokens-1);}
    else out.push(false);
    last=t;
  }
  return out;
}`,tests:[
  {tier:'sample',name:'immediate burst',input:{capacity:2,rate:1,times:[0,0,0]},expected:[true,true,false]},
  {tier:'sample',name:'refill',input:{capacity:2,rate:1,times:[0,0,0,1]},expected:[true,true,false,true]},
  {tier:'core',name:'fractional tokens',input:{capacity:2,rate:0.5,times:[0,0,1,2]},expected:[true,true,false,true]},
  {tier:'edge',name:'empty',input:{capacity:3,rate:2,times:[]},expected:[]},
  {tier:'edge',name:'no refill',input:{capacity:1,rate:0,times:[0,1,2]},expected:[true,false,false]},
  {tier:'stress',name:'many simultaneous',input:{capacity:10,rate:1,times:Array(2000).fill(0)},expected:Array.from({length:2000},(_,i)=>i<10)}
 ],tasks:['Prove that tokens never exceeds capacity.','Explain what changes when clocks can jump backwards.','What should happen under concurrent requests to a shared limiter?'],hint:['Refill before each decision.','Always clamp refill with min(capacity, ...).']}
];
const CPP_LABS = [
 {id:'cpp-two-sum',title:'C++20 correctness and test design',week:'01',description:'Implement two-sum using std::unordered_map. Develop table-driven tests before optimizing.',concepts:['std::vector stores a contiguous sequence; operator[] indexes an element.','std::unordered_map stores key-value pairs with expected constant-time operations; find avoids inserting.','An assertion tests a property and aborts the program on failure.'],file:'cpp/include/two_sum.hpp',test:'cpp/tests/test_two_sum.cpp',focus:'Algorithm correctness, edge cases, expected versus worst-case complexity.'},
 {id:'cpp-spsc',title:'SPSC ring buffer and C++ memory ordering',week:'02',description:'Implement a bounded single-producer single-consumer queue with release/acquire publication and a concurrent test.',concepts:['std::atomic expresses synchronized memory operations.','release publishes preceding writes; acquire synchronizes with a release on the same atomic when the acquire observes the release sequence.','A ring uses indexes modulo capacity; cache-line effects matter for performance.'],file:'cpp/include/spsc_ring.hpp',test:'cpp/tests/test_spsc_ring.cpp',focus:'Ownership, happens-before reasoning, wraparound, stress testing, capacity.'},
 {id:'cpp-book',title:'Limit order book: price-time matching',week:'03',description:'Implement a deterministic matching engine with integer ticks, queue priority, partial fills, cancellations and invariants.',concepts:['A limit order rests at a price and can execute at that price or better.','Price-time priority consumes the best price first, then earliest resting order at that price.','Integer ticks avoid floating-point comparison ambiguity.'],file:'cpp/include/order_book.hpp',test:'cpp/tests/test_order_book.cpp',focus:'Event replay, deterministic testing, partial fills, latency/throughput baselines.'}
];