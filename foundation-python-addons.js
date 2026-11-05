/* Foundation Academy: original incremental Python problems beyond the introductory bank. */
(function(root){'use strict';
const T=(id,title,track,level,pattern,fn,statement,rule,hints,pitfall,complexity,starter,solution,lesson,cases)=>({
 id,title,track,level,pattern,fn,statement,rule,hints,pitfall,complexity,starter,solution,lesson,cases:cases.map(([args,expected])=>({args,expected}))
});
const tasks=[
T('clamp_score','Clamp a numeric score','foundation','C0 · Contract basics','Branching','clamp_score',
 'Given integer value, lower and upper bounds (lower<=upper), return lower if the value is too small, upper if too large, or the value otherwise. Do not modify input.',
 'The result is always in [low,high], and equals value when value already belongs to that interval.',
 ['Handle values below the lower bound first.','Use min and max, or two explicit branches.'],
 'Comparing with only one bound fails values outside the other end; do not swap provided bounds silently.',
 'O(1) time and space.',
 'def clamp_score(value, low, high):\n    pass\n',
 'def clamp_score(value, low, high):\n    return max(low, min(value, high))\n',
 'foundation.html#C0/c0-contract',[
  [[3,0,10],3], [[-5,0,10],0],[[50,0,10],10],[[0,0,10],0],
  [[10,0,10],10],[[5,5,5],5],[[-6,-4,-2],-4],[[10,-4,-2],-2]
 ]),
T('first_positive','Find the first strictly positive index','foundation','C0 · Loop invariants','Linear scan','first_positive',
 'Return the index of the first positive integer (>0) in the input list, or -1 if none exists. The list may be empty; do not mutate it.',
 'Before inspecting index i, every earlier value is nonpositive; therefore the first positive encountered is the earliest possible match.',
 ['Use enumerate(values).','Return immediately only if value > 0; otherwise return -1 after the loop.'],
 'Checking >=0 incorrectly counts zero as positive; returning the last matching index violates first-occurrence semantics.',
 'O(n) time, O(1) auxiliary space.',
 'def first_positive(values):\n    pass\n',
 'def first_positive(values):\n    for index, value in enumerate(values):\n        if value > 0:\n            return index\n    return -1\n',
 'foundation.html#C0/c0-edge',[
  [[[]],-1],[[[0,-1,4,3]],2],[[[1,2,3]],0],[[[-1,-2,-3]],-1],
  [[[0]],-1],[[[3]],0],[[[-4,-1,0,0,2]],4],[[[0,0,0,0]],-1]
 ]),
T('count_nonnegative','Count values satisfying a predicate','foundation','C0 · Test design','Predicate counting','count_nonnegative',
 'Given a list of integers, return the number of elements >=0. Count every occurrence, including duplicate zeroes; do not modify the list.',
 'After processing the first i inputs, count equals the number of nonnegative elements among exactly that prefix.',
 ['Start with count=0.','Increase it when value >= 0; never decrease it.'],
 'Counting unique values using a set is wrong when duplicates are meaningful.',
 'O(n) time, O(1) auxiliary space.',
 'def count_nonnegative(values):\n    pass\n',
 'def count_nonnegative(values):\n    count = 0\n    for value in values:\n        if value >= 0:\n            count += 1\n    return count\n',
 'foundation.html#C0/c0-recall',[
  [[[]],0],[[[0]],1],[[[-1]],0],[[[1,2,3]],3],
  [[[-1,0,-1,0]],2],[[[10,10,-5]],2],[[[-10,-9,-8]],0],[[[0,0,0,0]],4]
 ]),
T('unique_in_order','Deduplicate without reordering','foundation','C1 · Collections','Set plus list','unique_in_order',
 'Given strings, return a new list containing the first occurrence of each distinct string, preserving its original order. Case is significant.',
 'Before each next input, seen contains exactly the elements already emitted and result lists them in first-occurrence order.',
 ['Keep a result list and a separate seen set.','When a value is new, append it to result and add it to seen.'],
 'Converting directly to a set loses the required ordered first-occurrence output contract.',
 'O(n) expected time and O(k) space for k unique strings.',
 'def unique_in_order(values):\n    pass\n',
 'def unique_in_order(values):\n    seen, result = set(), []\n    for value in values:\n        if value not in seen:\n            seen.add(value)\n            result.append(value)\n    return result\n',
 'foundation.html#C1/c1-values',[
  [[[]],[]],[[['a','b','a']],['a','b']],[[['x']],['x']],
  [[['A','a','A']],['A','a']],[[['','']],['']],
  [[['b','a','b','c','a']],['b','a','c']],
  [[['one','two','three']],['one','two','three']],
  [[['z','z','z','a']],['z','a']]
 ]),
T('safe_divide','Define a safe division contract','foundation','C1 · Exceptions','Guarded arithmetic','safe_divide',
 'For integer numerator and denominator, return the Python floating-point quotient numerator/denominator. Return None when denominator is zero. Negative denominators are allowed.',
 'The division is evaluated only when the denominator is nonzero; the output is either None or the exact Python quotient for these inputs.',
 ['Check denominator == 0 before / .','Return None for the zero case, not zero.'],
 'Returning 0 for zero denominator confuses an invalid quotient with a legitimate zero numerator.',
 'O(1) time and space.',
 'def safe_divide(numerator, denominator):\n    pass\n',
 'def safe_divide(numerator, denominator):\n    if denominator == 0:\n        return None\n    return numerator / denominator\n',
 'foundation.html#C1/c1-exceptions',[
  [[10,2],5.0],[[1,2],0.5],[[0,5],0.0],[[5,0],null],
  [[-6,3],-2.0],[[6,-3],-2.0],[[-6,-3],2.0],[[7,2],3.5]
 ]),
T('running_totals','Compute prefix sums','foundation','C1 · Iteration','Stateful transformation','running_totals',
 'Given integers, return a new list where output[i] equals the sum of values[0:i+1]. Do not mutate input; an empty list returns [].',
 'After processing prefix length i, the accumulator equals its sum, and every emitted output index contains the corresponding prefix sum.',
 ['Maintain one accumulator.','Append the accumulator after adding each element.'],
 'Appending before the addition produces a shifted prefix; using the total of all items at every position is not prefix sums.',
 'O(n) time and O(n) output space; O(1) additional working state.',
 'def running_totals(values):\n    pass\n',
 'def running_totals(values):\n    result = []\n    total = 0\n    for value in values:\n        total += value\n        result.append(total)\n    return result\n',
 'foundation.html#C1/c1-control',[
  [[[]],[]],[[[1,2,3]],[1,3,6]],[[[-1,-2] ],[-1,-3]],
  [[[0,0,0]],[0,0,0]],[[[5]],[5]],[[[4,-4,4]],[4,0,4]],
  [[[10,-5,2,1]],[10,5,7,8]],[[[-9,9] ],[-9,0]]
 ]),
T('two_sum_indices','First feasible complement pair','swe','C2 · Hash patterns','Complement lookup','two_sum_indices',
 'Given integer nums and integer target, return [i,j] with i<j and nums[i]+nums[j]==target, choosing the smallest possible j; when several i match that j, choose smallest i. Return [] when no pair exists.',
 'Before index j, seen stores the earliest index of each value among indices <j; the first discovered feasible j is globally earliest.',
 ['Maintain a dictionary from value to its first index.','At j, check target-nums[j] before inserting nums[j].'],
 'If you insert before checking, a single value can improperly pair with itself.',
 'O(n) expected time and O(n) auxiliary space.',
 'def two_sum_indices(nums, target):\n    pass\n',
 'def two_sum_indices(nums, target):\n    seen = {}\n    for j, value in enumerate(nums):\n        want = target - value\n        if want in seen:\n            return [seen[want], j]\n        if value not in seen:\n            seen[value] = j\n    return []\n',
 'foundation.html#C2/c2-hash',[
  [[[2,7,11,15],9],[0,1]],[[[3,3],6],[0,1]],[[[1,2,3],9],[]],
  [[[],0],[]],[[[5],10],[]],[[[1,5,1,5],6],[0,1]],
  [[[4,-1,2,7],6],[1,3]],[[[-4,-2,6,10],8],[1,3]]
 ]),
T('balanced_brackets','Validate nested brackets','swe','C2 · Stacks','Stack discipline','balanced_brackets',
 'Given a string containing only the six bracket characters ()[]{}, return True if it forms a correctly nested sequence, and False otherwise. Empty string is valid.',
 'The stack contains precisely the unmatched opening brackets of the processed prefix, in nesting order.',
 ['Push opening brackets.','For each closing bracket, require a matching opener at the top of the stack.'],
 'Counting the total number of opens and closes is insufficient: ([)] has equal counts but invalid nesting.',
 'O(n) time and O(n) worst-case stack memory.',
 'def balanced_brackets(s):\n    pass\n',
 'def balanced_brackets(s):\n    stack = []\n    pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}\n    for char in s:\n        if char in \'([{\' :\n            stack.append(char)\n        elif not stack or stack.pop() != pairs[char]:\n            return False\n    return not stack\n',
 'foundation.html#C2/c2-structures',[
  [[''],true],[['()'],true],[['([])'],true],[['([)]'],false],
  [['{[()]}'],true],[['('],false],[[']'],false],[['()[]{}'],true],
  [['((()))'],true]
 ]),
T('coin_ways','Count coin combinations with DP','swe','C2 · Dynamic programming','Unbounded knapsack','coin_ways',
 'Given distinct positive integer denominations and a nonnegative target, return the number of unordered combinations that sum to target, with unlimited coins of each denomination. For target 0, return 1 (choose none).',
 'After processing the first i denominations, dp[s] counts combinations for amount s using only those i denominations.',
 ['Set dp[0]=1.','Loop over each coin outside; then amounts from coin to target inside to allow repeated use without counting permutations.'],
 'Looping amounts outside and coins inside counts permutations instead of unordered combinations.',
 'O(target * number_of_coins) time and O(target) space.',
 'def coin_ways(coins, target):\n    pass\n',
 'def coin_ways(coins, target):\n    dp = [0] * (target + 1)\n    dp[0] = 1\n    for coin in coins:\n        for amount in range(coin, target + 1):\n            dp[amount] += dp[amount - coin]\n    return dp[target]\n',
 'foundation.html#C2/c2-graphs',[
  [[[1,2,5],5],4],[[[],0],1],[[[],5],0],
  [[[2],3],0],[[[2],4],1],[[[1],3],1],
  [[[1,2],4],3],[[[2,3,7],7],2],[[[1,3,4],6],4]
 ]),
T('bayes_update','Update a belief after a positive test','quant','C3 · Conditional probability','Bayesian evidence','bayes_update',
 'Given prior P(A), sensitivity P(+|A) and false-positive rate P(+|not A), return P(A|+) by Bayes formula. Return None if the probability of a positive test is zero. Inputs lie in [0,1].',
 'Posterior = prior*sensitivity / (prior*sensitivity+(1-prior)*false_positive_rate), provided denominator>0.',
 ['Calculate true-positive probability.','Divide by all positive outcomes, not just those with A.'],
 'P(+|A) is not equal to P(A|+); low base rates can dominate positive results.',
 'O(1) time and space.',
 'def bayes_update(prior, sensitivity, false_positive_rate):\n    pass\n',
 'def bayes_update(prior, sensitivity, false_positive_rate):\n    true_positive = prior * sensitivity\n    denominator = true_positive + (1 - prior) * false_positive_rate\n    return true_positive / denominator if denominator else None\n',
 'foundation.html#C3/c3-counting',[
  [[0.01,0.9,0.1],1/12],[[0.5,1,0],1.0],[[0.5,0,1],0.0],
  [[0,0.9,0.1],0.0],[[1,0.9,0.1],1.0],[[0,0.5,0],null],
  [[1,0,0],null],[[0.2,0.8,0.2],0.5],
  [[0.1,0.7,0.3],0.07/0.34]
 ]),
T('bernoulli_stderr','Bernoulli sample standard error','ml','C3 · Statistical inference','Variance and sampling','bernoulli_stderr',
 'Given success probability p in [0,1] and sample size n>=1, return theoretical standard deviation of the IID Bernoulli sample mean: sqrt(p*(1-p)/n).',
 'For independent draws the variance of the mean is p(1-p)/n; square-root gives standard deviation.',
 ['Calculate Bernoulli variance p*(1-p).','Divide by n and apply math.sqrt.'],
 'Do not divide standard deviation by n; it shrinks as sqrt(n). Correlated samples invalidate the IID formula.',
 'O(1) time and space.',
 'def bernoulli_stderr(p, n):\n    pass\n',
 'def bernoulli_stderr(p, n):\n    from math import sqrt\n    return sqrt(p * (1 - p) / n)\n',
 'foundation.html#C3/c3-variance',[
  [[0.5,100],0.05],[[0.5,400],0.025],[[0,10],0],[[1,10],0],
  [[0.5,1],0.5],[[0.2,25],0.08],[[0.8,100],0.04],
  [[0.1,9],0.1],[[0.25,4],Math.sqrt(0.25*0.75/4)]
 ]),
T('matrix_vector','Multiply a matrix by a vector','ml','C3 · Linear algebra','Dot products','matrix_vector',
 'Given a rectangular integer matrix (list of rows) and an integer vector of matching column count, return matrix-vector product as a list of integer row dot-products. Empty matrix returns [].',
 'Each result row i is the sum of row[i][j]*vector[j] across all columns j; output length equals number of rows.',
 ['Check dimensions conceptually before computing.','Use sum(a*b for a,b in zip(row,vector)) per row.'],
 'Summing all matrix entries into one scalar loses row structure; mismatched dimensions are outside the stated preconditions.',
 'O(m*n) time and O(m) output space for m rows and n columns.',
 'def matrix_vector(matrix, vector):\n    pass\n',
 'def matrix_vector(matrix, vector):\n    return [sum(a*b for a,b in zip(row, vector)) for row in matrix]\n',
 'foundation.html#C3/c3-linear',[
  [[[[1,2],[3,4]],[5,6]],[17,39]],
  [[[],[]],[]],
  [[[[1,0]],[10,9]],[10]],
  [[[[0,0]],[7,8]],[0]],
  [[[[-1,2],[2,-3]],[3,5]],[7,-9]],
  [[[[2],[3],[4]],[5]],[10,15,20]],
  [[[[1,1,1]],[1,2,3]],[6]],
  [[[[2,-1],[5,0]],[-2,4]],[-8,-10]]
 ]),
T('aggregate_trades','Aggregate deduplicated market events','foundation','C4 · Reliability','Stable event identity','aggregate_trades',
 'Each input event is [unique_id,symbol,quantity] with nonnegative integer quantity. Events may repeat the same ID with conflicting payload. Keep only the first occurrence for each ID, and return total quantity per symbol as a dictionary.',
 'After i events, seen contains first-observed IDs and totals represent exactly the first payload for each such ID.',
 ['Deduplicate by ID before updating totals.','Accumulate by symbol only on the first event with each ID.'],
 'Deduplicating by symbol drops legitimate distinct trades; counting duplicate IDs inflates totals.',
 'O(n) expected time and O(k) space for seen IDs plus distinct symbols.',
 'def aggregate_trades(events):\n    pass\n',
 'def aggregate_trades(events):\n    seen, totals = set(), {}\n    for event_id, symbol, quantity in events:\n        if event_id in seen:\n            continue\n        seen.add(event_id)\n        totals[symbol] = totals.get(symbol, 0) + quantity\n    return totals\n',
 'foundation.html#C4/c4-apis',[
  [[[]],{}],
  [[[[1,'A',10]]],{A:10}],
  [[[[1,'A',10],[2,'A',5]]],{A:15}],
  [[[[1,'A',10],[1,'A',99]]],{A:10}],
  [[[[1,'A',10],[2,'B',2],[3,'A',1]]],{A:11,B:2}],
  [[[[0,'X',0],[0,'Y',3],[1,'X',5]]],{X:5}],
  [[[[1,'B',4],[2,'A',1],[1,'B',9],[3,'B',2]]],{B:6,A:1}],
  [[[[-1,'X',2],[-2,'X',5],[-1,'Y',7]]],{X:7}]
 ]),
T('http_status_classes','Summarize HTTP error and success families','foundation','C4 · APIs and monitoring','Validated aggregation','http_status_classes',
 'Given a list of integer HTTP status codes, return exactly the dictionary {"2xx":count,"4xx":count,"5xx":count} for codes 200–299, 400–499 and 500–599 respectively. Ignore 1xx, 3xx and all out-of-range values.',
 'The three counters at iteration i count only matching status classes in the processed prefix.',
 ['Initialize all three keys to zero.','Branch on numeric ranges and increment only one corresponding class.'],
 'Counting all codes >=400 as server errors misclassifies client errors as server errors.',
 'O(n) time and O(1) auxiliary space.',
 'def http_status_classes(codes):\n    pass\n',
 'def http_status_classes(codes):\n    result = {"2xx":0, "4xx":0, "5xx":0}\n    for code in codes:\n        if 200 <= code <= 299:\n            result["2xx"] += 1\n        elif 400 <= code <= 499:\n            result["4xx"] += 1\n        elif 500 <= code <= 599:\n            result["5xx"] += 1\n    return result\n',
 'foundation.html#C4/c4-apis',[
  [[[]],{'2xx':0,'4xx':0,'5xx':0}],
  [[[200,201,204]],{'2xx':3,'4xx':0,'5xx':0}],
  [[[400,404,429]],{'2xx':0,'4xx':3,'5xx':0}],
  [[[500,502,503]],{'2xx':0,'4xx':0,'5xx':3}],
  [[[100,301,600]],{'2xx':0,'4xx':0,'5xx':0}],
  [[[200,400,500]],{'2xx':1,'4xx':1,'5xx':1}],
  [[[299,399,499,599]],{'2xx':1,'4xx':1,'5xx':1}],
  [[[0,-1,200,299,404,500,599,999]],{'2xx':2,'4xx':1,'5xx':2}]
 ]),
T('nearest_rank_p95','Compute measured p95 latency','foundation','C4 · Profiling','Distribution summarization','nearest_rank_p95',
 'Given a list of nonnegative integer latency measurements, return the nearest-rank 95th percentile: sort ascending and select one-based rank ceil(0.95*n). Return None for empty input. Do not modify input.',
 'For n measurements, index ceil(0.95*n)-1 points to the observed value at which at least 95% of samples are at or below it.',
 ['Sort a copy, leaving the original intact.','Use math.ceil(0.95 * n)-1 as the zero-based index.'],
 'Using an average or interpolated percentile silently changes the defined measurement contract; throughput is not p95 latency.',
 'O(n log n) time and O(n) auxiliary space for sorting a copy.',
 'def nearest_rank_p95(values):\n    pass\n',
 'def nearest_rank_p95(values):\n    from math import ceil\n    if not values:\n        return None\n    ordered = sorted(values)\n    return ordered[ceil(0.95 * len(values))-1]\n',
 'foundation.html#C4/c4-profiling',[
  [[[]],null],[[[5]],5],[[[1,2]],2],[[[10,10,10]],10],
  [[Array.from({length:20},(_,i)=>i+1)],19],
  [[Array.from({length:21},(_,i)=>i+1)],20],
  [[[100,1,2,3]],100],[[[0,1000]],1000],[[[9,5,7]],9]
 ])
];
function validate(){
 const ids=new Set();for(const t of tasks){if(ids.has(t.id)||!t.fn||t.cases.length<8||!t.solution.includes('def '+t.fn+'('))throw Error('Invalid extra lab '+t.id);ids.add(t.id);}
 return tasks.length===15;
}
if(!validate())throw Error('Bad foundation lab extensions');
if(typeof module!=='undefined'&&module.exports)module.exports=tasks;
root.MasteryFoundationPythonAddons=tasks;
})(typeof window!=='undefined'?window:globalThis);