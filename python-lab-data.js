/* Original, curriculum-aligned Python exercises. Cases are deterministic and inspectable. */
(function(root){'use strict';
const T=(id,title,track,level,pattern,fn,statement,rule,hints,pitfall,complexity,starter,solution,lesson,cases)=>({
 id,title,track,level,pattern,fn,statement,rule,hints,pitfall,complexity,starter,solution,lesson,cases
});
const tests=(pairs)=>pairs.map(([args,expected])=>({args,expected}));
const tasks=[
T('sum_positive','Sum the positive observations','foundation','01 · Foundations','Loop invariants','sum_positive',
 'Given an iterable of integers, return the sum of strictly positive values. Zero and negatives do not contribute. The input is not modified.',
 'After processing the first i values, the accumulator equals the sum of positives among those first i values.',
 ['Start from an accumulator of zero.','Update it only when the next value is greater than zero.'],
 'Using >= does not change the sum but hides the exact contract. Do not mistake a list of negatives for an error.',
 'O(n) time and O(1) auxiliary memory.',
 'def sum_positive(values):\n    # Return a sum, not a list.\n    pass\n',
 'def sum_positive(values):\n    total = 0\n    for value in values:\n        if value > 0:\n            total += value\n    return total\n',
 'roadmap.html',
 tests([
  [[[1,2,3]],6],[[[-5,-2,0]],0],[[[]],0],[[[0]],0],[[[100,-100,1]],101],
  [[[4,4,4]],12],[[[-1,2,-3,4,-5,6]],12],[[[10**5, -5,10]],100010]
 ])),
T('symbol_counts','Count market updates by symbol','foundation','02 · Python collections','Hash maps','symbol_counts',
 'Given a list of stock-symbol strings such as ["AAPL","MSFT","AAPL"], return a dictionary mapping each distinct symbol to its frequency. Preserve exact case, and do not sort or alter input.',
 'After reading i symbols, count[s] equals the number of occurrences of s in that prefix.',
 ['A dictionary is a natural fit. What does dict.get(key, default) do?','For each symbol, update the old count by one.'],
 'A set removes duplicates; it cannot track how often each symbol appears.',
 'O(n) expected time, O(k) auxiliary memory for k distinct symbols; hash collisions can affect worst-case behavior.',
 'def symbol_counts(events):\n    # Count each symbol.\n    pass\n',
 'def symbol_counts(events):\n    counts = {}\n    for symbol in events:\n        counts[symbol] = counts.get(symbol, 0) + 1\n    return counts\n',
 'engineering.html#track=dsa&lesson=hash',
 tests([
  [[['AAPL','MSFT','AAPL']],{AAPL:2,MSFT:1}],
  [[[]],{}],[[['X']],{X:1}],[[['a','A','a']],{a:2,A:1}],
  [[['MSFT','MSFT','MSFT']],{MSFT:3}],
  [[['A','B','C','A','B']],{A:2,B:2,C:1}],
  [[['','X','']],{'':2,X:1}],
  [[['TSLA','NVDA','TSLA','NVDA','TSLA']],{TSLA:3,NVDA:2}]
 ])),
T('longest_unique','Longest substring without repeats','swe','03 · Windows','Sliding window','longest_unique',
 'Return the length of the longest contiguous substring containing no repeated characters. Characters are case-sensitive; the empty string returns zero. Aim for linear time.',
 'At every right endpoint, the left boundary lies strictly after the last occurrence of any repeated character within the active window.',
 ['Keep a map of each character to its most recent index.','Update left = max(left, last_index + 1) when the character was seen.'],
 'The left boundary must never move backward when a duplicate happened before the current window.',
 'O(n) expected time and O(k) memory for at most k distinct characters.',
 'def longest_unique(s):\n    pass\n',
 'def longest_unique(s):\n    left, best, last = 0, 0, {}\n    for right, char in enumerate(s):\n        if char in last:\n            left = max(left, last[char] + 1)\n        last[char] = right\n        best = max(best, right - left + 1)\n    return best\n',
 'engineering.html#track=dsa&lesson=window',
 tests([
  [['abcabcbb'],3],[['bbbbb'],1],[[''],0],[['a'],1],
  [['pwwkew'],3],[['abba'],2],[['dvdf'],3],[['abcdef'],6],[['AaA'],2]
 ])),
T('binary_first','First matching index','swe','04 · Searching','Binary search','binary_first',
 'Given ascending sorted integers with possible duplicates and a target, return its first index or -1. Do not scan linearly after a match.',
 'Maintain a half-open search range [lo, hi) containing the lower bound of target; after termination, verify that the lower bound equals target.',
 ['Look for the first index with nums[i] >= target.','When nums[mid] >= target, keep the left half, including mid.'],
 'Breaking as soon as nums[mid] == target does not ensure the first duplicate.',
 'O(log n) time and O(1) auxiliary memory.',
 'def binary_first(nums, target):\n    pass\n',
 'def binary_first(nums, target):\n    lo, hi = 0, len(nums)\n    while lo < hi:\n        mid = lo + (hi-lo)//2\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo if lo < len(nums) and nums[lo] == target else -1\n',
 'engineering.html#track=dsa&lesson=binary',
 tests([
  [[[1,2,2,2,5],2],1],[[[],3],-1],[[[2],2],0],[[[2],3],-1],
  [[[1,1,1],1],0],[[[-5,-1,0,2],-1],1],[[[0,3,9],7],-1],[[[2,4,6],6],2],[[[5,5,5,5],4],-1]
 ])),
T('rolling_vwap','Compute a robust VWAP','quant','05 · Quant data','Weighted aggregation','rolling_vwap',
 'Each trade is [price, quantity]. Return volume-weighted average price sum(price*quantity)/sum(quantity), rounded to four decimals. Quantity is a nonnegative integer; return None if the total quantity is zero.',
 'Maintain exactly two sufficient statistics: total traded notional and total valid quantity.',
 ['Accumulate price * quantity in the numerator.','Guard zero total quantity before dividing; round the final ratio once.'],
 'A mean of trade prices is not VWAP. Rounding each individual trade may introduce bias.',
 'O(n) time, O(1) memory; floating-point price inputs have finite precision.',
 'def rolling_vwap(trades):\n    pass\n',
 'def rolling_vwap(trades):\n    notional, qty = 0.0, 0\n    for price, volume in trades:\n        notional += price * volume\n        qty += volume\n    return round(notional / qty, 4) if qty else None\n',
 'index.html#/lesson/orderbook',
 tests([
  [[[[100,1],[102,1]]],101.0],[[[]],null],[[[[100,0]]],null],
  [[[[100,1]]],100.0],[[[[100,1],[110,3]]],107.5],
  [[[[10,2],[20,3],[30,5]]],23.0],[[[[99.5,2],[100.5,2]]],100.0],
  [[[[100.01,3],[100.02,1]]],100.0125]
 ])),
T('dedup_events','Deduplicate an event stream','foundation','06 · Production habits','Idempotency','dedup_events',
 'Each event is [event_id, symbol, quantity]. Return a new list containing only the first event for each ID, in original arrival order. IDs compare exactly; different IDs may share the same symbol. Never mutate the input.',
 'Before the next event, seen contains exactly the IDs of all events already emitted.',
 ['Track seen IDs in a set, separate from the result list.','Append only when an ID has not been seen; then record it.'],
 'Do not use the symbol as an identity key. Idempotency depends on a stable event identifier.',
 'O(n) expected time and O(k) auxiliary memory for distinct event IDs.',
 'def dedup_events(events):\n    pass\n',
 'def dedup_events(events):\n    seen, result = set(), []\n    for event in events:\n        if event[0] not in seen:\n            result.append(event)\n            seen.add(event[0])\n    return result\n',
 'phase5.html',
 tests([
  [[[[1,'A',10],[2,'B',20],[1,'A',10]]],[[1,'A',10],[2,'B',20]]],
  [[[]],[]],[[[[1,'A',1]]],[[1,'A',1]]],
  [[[[1,'A',1],[1,'A',2]]],[[1,'A',1]]],
  [[[[1,'A',1],[2,'A',1]]],[[1,'A',1],[2,'A',1]]],
  [[[[0,'X',0],[0,'Y',100]]],[[0,'X',0]]],
  [[[[3,'B',1],[1,'A',1],[3,'B',2],[2,'C',1],[1,'A',5]]],[[3,'B',1],[1,'A',1],[2,'C',1]]],
  [[[[-1,'X',2],[-2,'X',2],[-1,'X',3]]],[[-1,'X',2],[-2,'X',2]]]
 ])),
T('bfs','Shortest paths in an unweighted graph','swe','07 · Graph reasoning','Breadth-first search','bfs',
 'Given an adjacency dictionary of string node IDs mapped to neighbor lists and a start node, return a dictionary of shortest-path edge counts from start to every reachable node. Missing adjacency keys represent vertices with no outgoing edges.',
 'Every dequeued vertex has a settled minimum hop distance; the queue explores nodes in nondecreasing distance order.',
 ['Use collections.deque; mark nodes visited when enqueuing, not when removing.','Distance of a newly discovered neighbor is distance[current] + 1.'],
 'A stack computes depth-first traversal; BFS needs a queue to certify minimum unweighted distance.',
 'O(V+E) time and O(V) auxiliary memory for reachable vertices and scanned edges.',
 'def bfs(graph, start):\n    pass\n',
 'def bfs(graph, start):\n    from collections import deque\n    distance = {start: 0}\n    q = deque([start])\n    while q:\n        u = q.popleft()\n        for v in graph.get(u, []):\n            if v not in distance:\n                distance[v] = distance[u] + 1\n                q.append(v)\n    return distance\n',
 'engineering.html#track=dsa&lesson=graphs',
 tests([
  [[{A:['B','C'],B:['D'],C:['D'],D:[]},'A'],{A:0,B:1,C:1,D:2}],
  [[{},'A'],{A:0}],[[{A:[]},'A'],{A:0}],[[{A:['A']},'A'],{A:0}],
  [[{A:['B'],B:['C'],C:[]},'A'],{A:0,B:1,C:2}],
  [[{A:['B'],B:[],C:['A']},'A'],{A:0,B:1}],
  [[{X:['Y','Y'],Y:['Z'],Z:[]},'X'],{X:0,Y:1,Z:2}],
  [[{A:['B','C'],B:['E'],C:['D'],D:['E'],E:[]},'A'],{A:0,B:1,C:1,E:2,D:2}]
 ])),
T('gradient_step','One gradient-descent step','ml','08 · Optimization','Differentiation','gradient_step',
 'For scalar loss L(w)=(w*x-y)^2, return one update w_new = w - lr*dL/dw. Inputs are numbers, lr is nonnegative; do not fit a whole model.',
 'Chain rule gives dL/dw = 2*(w*x-y)*x. Evaluate this gradient at the OLD weight.',
 ['Differentiate (wx-y)^2 with the chain rule.','Subtract learning_rate times the gradient from the old weight.'],
 'Updating w inside the gradient expression before computing it changes the algorithm.',
 'O(1) time and memory per update.',
 'def gradient_step(w, x, y, lr):\n    pass\n',
 'def gradient_step(w, x, y, lr):\n    return w - lr * 2 * (w * x - y) * x\n',
 'index.html#/lesson/multivariable',
 tests([
  [[1,2,4,0.1],1.8],
  [[0,1,1,0.1],0.2],[[1,1,1,0.1],1],[[2,0,10,0.5],2],
  [[3,-1,2,0.1],2],[[5,2,0,0],5],[[1,2,3,0.1],1.4],[[0,3,6,0.05],1.8]
 ])),
T('stable_sigmoid','Numerically stable sigmoid','ml','09 · Model numerics','Stable functions','stable_sigmoid',
 'Return sigma(x)=1/(1+exp(-x)) as a float. Inputs may be as large as ±1000. Use a branch to avoid overflow for very negative x.',
 'For x>=0 use exp(-x); for x<0 use exp(x)/(1+exp(x)). Both formulas are algebraically equivalent and numerically safe.',
 ['Split on the sign of x.','For negative x, multiply numerator and denominator by exp(x).'],
 'Naively computing exp(-x) when x=-1000 overflows despite the sigmoid being near zero.',
 'O(1) time and memory.',
 'def stable_sigmoid(x):\n    pass\n',
 'def stable_sigmoid(x):\n    from math import exp\n    if x >= 0:\n        return 1 / (1 + exp(-x))\n    e = exp(x)\n    return e / (1 + e)\n',
 'index.html#/lesson/numerical-methods',
 tests([
  [[0],0.5],[[1],0.7310585786300049],[[-1],0.2689414213699951],
  [[1000],1.0],[[-1000],0.0],[[10],0.9999546021312976],
  [[-10],0.00004539786870243439],[[2],0.8807970779778823],[[ -2 ],0.11920292202211755]
 ])),
T('window_max_sum','Best fixed-size interval','quant','10 · Streaming analysis','Sliding window','window_max_sum',
 'Given signed integer readings and a window length k, return the maximum sum of any contiguous window of size k. Return None for k<=0 or k>len(values). O(n) time, not O(n*k).',
 'After advancing from window [i,i+k) to [i+1,i+k+1), add the entering value and subtract the leaving value.',
 ['Compute the first window once.','Slide in O(1) per step by add-right/subtract-left.'],
 'All-negative windows must return a negative maximum; initializing the best sum to zero is wrong.',
 'O(n) time, O(1) auxiliary memory.',
 'def window_max_sum(values, k):\n    pass\n',
 'def window_max_sum(values, k):\n    if k <= 0 or k > len(values):\n        return None\n    total = sum(values[:k])\n    best = total\n    for i in range(k, len(values)):\n        total += values[i] - values[i-k]\n        best = max(best, total)\n    return best\n',
 'engineering.html#track=dsa&lesson=window',
 tests([
  [[[1,2,3,4],2],7],[[[-5,-2,-3],2],-5],[[[],1],null],
  [[[2,3],0],null],[[[2,3],3],null],[[[5],1],5],
  [[[1,1,1],3],3],[[[-1,5,-2,6],2],4],[[[10,-9,10,-9],2],1]
 ]))
];
for(const t of tasks)t.numericMode=['rolling_vwap','gradient_step','stable_sigmoid'].includes(t.id)?'float':'exact';
const map=Object.fromEntries(tasks.map(t=>[t.id,t]));
function validate(){
 if(tasks.length<10||new Set(tasks.map(t=>t.id)).size!==tasks.length)throw Error('Invalid lab bank');
 for(const t of tasks)if(t.cases.length<6||!t.solution||!t.rule||!t.pitfall||!t.complexity||!t.fn)throw Error('Incomplete exercise '+t.id);
 return true;
}
const api={version:'v1',tasks,lookup:id=>map[id]||null,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryPythonLab=api;
})(typeof window!=='undefined'?window:globalThis);