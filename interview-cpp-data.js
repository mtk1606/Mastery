/* Phase IX — original C++20 interview workshops; linked LeetCode references remain with publisher. */
'use strict';
const IX_LESSONS = [
{
 id:'valid-parentheses',title:'Matching delimiters with a stack',unit:'01 / Linear data structures',minutes:30,level:'Easy → Medium',
 url:'https://leetcode.com/problems/valid-parentheses/',
 contract:'bool isValid(const std::string& s)',
 brief:'Decide whether each opening bracket is matched by a corresponding closing bracket in correct nesting order. The empty string is valid.',
 glossary:[['Stack','A last-in-first-out collection. The latest unmatched opening bracket must be closed before earlier brackets.'],['std::vector::back()','Reads the last element; calling it on an empty vector is invalid.'],['push_back / pop_back','Append to or remove from the end of a vector; each operation is amortized O(1).'],['Invariant','A property preserved at every iteration. After each character, the stack equals the unmatched openers, in encounter order.']],
 strategy:['Before reading a character, the stack contains exactly the unmatched opening brackets.','Push an opener. For a closer, reject an empty stack or a mismatched top, otherwise pop.','At the end accept only if no opener remains.'],
 complexity:{time:'O(n)',space:'O(n)',why:'Each character is processed once. At most n opening brackets remain in the stack.'},
 invariant:{question:'What must the stack represent after reading a prefix?',choices:['Every opening bracket ever seen','Exactly the currently unmatched opening brackets in nesting order','The number of closing brackets'],answer:1,explain:'Stale matched openers must have been popped; only unmatched openers remain.'},
 complexityOptions:['O(1)','O(log n)','O(n)','O(n log n)','O(n²)'], timeAnswer:2,spaceAnswer:2,
 starter:`bool isValid(const std::string& s) {
    // TODO: maintain the unmatched openers and validate every closer.
    return false;
}`,
 reference:`bool isValid(const std::string& s) {
    std::vector<char> st;
    for (char c : s) {
        if (c=='(' || c=='[' || c=='{') { st.push_back(c); continue; }
        if (st.empty()) return false;
        const char top=st.back();st.pop_back();
        if ((c==')'&&top!='(')||(c==']'&&top!='[')||(c=='}'&&top!='{'))return false;
    }
    return st.empty();
}`,
 worked:{input:'s = "([{}])"',steps:[['(','stack = ('],['[','stack = (['],['{','stack = ([{'],['}','pop { → (['],[']','pop [ → ('],[')','pop ( → empty → valid']]},
 proof:'Induct on the consumed prefix. Initially the stack is empty, matching zero unmatched openers. Push introduces exactly one unmatched opener; a matching closer removes precisely the most recent opener. A missing or mismatched top cannot be repaired by a later character. At termination, acceptance requires no remaining unmatched opener.',
 counterexample:'The string "([)]" has equal counts of every bracket type but invalid nesting. Counts alone are insufficient.',
 followups:['What changes if arbitrary non-bracket characters are permitted?','How would you report the first invalid position instead of a boolean?','Can you do it with less than O(n) worst-case auxiliary space? Defend your answer.']
},
{
 id:'binary-search',title:'Binary search and loop invariants',unit:'02 / Search & correctness',minutes:35,level:'Easy → Medium',
 url:'https://leetcode.com/problems/binary-search/',
 contract:'int searchIndex(const std::vector<int>& a, int target)',
 brief:'Given an ascending array of distinct integers, return the index of target, or −1. Do not read outside the array.',
 glossary:[['Half-open interval [lo, hi)','Includes lo and excludes hi; its size equals hi − lo.'],['std::size_t','Unsigned integer type for indexing; subtracting at zero may underflow. Prefer signed indices when computing hi − 1.'],['Loop invariant','At the start of each iteration, if the target exists, its index is in [lo, hi).'],['Overflow-safe midpoint','lo + (hi − lo)/2 avoids adding two potentially large endpoints.']],
 strategy:['Initialize lo=0 and hi=n. The target is somewhere in [0,n) if it exists.','Pick mid; if a[mid]<target, discard [lo,mid], else if a[mid]>target discard [mid,hi).','Return mid on equality, otherwise −1 when the interval is empty.'],
 complexity:{time:'O(log n)',space:'O(1)',why:'Every unsuccessful comparison halves the candidate interval; only a constant number of indices are stored.'},
 invariant:{question:'Which statement makes it safe to discard half the array?',choices:['The array has no duplicate elements and all values fit 32 bits','If the target appears, its index lies within the maintained [lo,hi) interval','The midpoint always increases'],answer:1,explain:'Ordering and the maintained candidate interval justify which half can be eliminated.'},
 complexityOptions:['O(1)','O(log n)','O(n)','O(n log n)','O(n²)'],timeAnswer:1,spaceAnswer:0,
 starter:`int searchIndex(const std::vector<int>& a, int target) {
    // TODO: maintain [lo, hi) and eliminate half after each comparison.
    return -1;
}`,
 reference:`int searchIndex(const std::vector<int>& a, int target) {
    int lo=0,hi=static_cast<int>(a.size());
    while (lo<hi) {
        const int mid=lo+(hi-lo)/2;
        if (a[mid]==target)return mid;
        if (a[mid]<target)lo=mid+1;
        else hi=mid;
    }
    return -1;
}`,
 worked:{input:'a = [1,4,7,9,12,18], target = 12',steps:[['[0,6), mid=3','a[3]=9 < 12 → lo=4'],['[4,6), mid=5','a[5]=18 > 12 → hi=5'],['[4,5), mid=4','a[4]=12 → return 4']]},
 proof:'Invariant: any occurrence lies in [lo,hi) at loop start. Comparison with the midpoint partitions a sorted array: no earlier element can exceed a[mid] and no later element can be less. Each update preserves the possible target and strictly decreases hi−lo. Empty interval proves absence.',
 counterexample:'Using hi=mid−1 with a half-open [lo,hi) convention accidentally discards an extra index; do not mix inclusive and exclusive endpoints.',
 followups:['Find the first index with value ≥ target (lower_bound).','Explain correctness when duplicates are allowed.','How would search work over an implicit monotone predicate rather than an array?']
},
{
 id:'sliding-window-maximum',title:'Monotonic deque for streaming maxima',unit:'03 / Amortized data structures',minutes:45,level:'Hard',
 url:'https://leetcode.com/problems/sliding-window-maximum/',
 contract:'std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k)',
 brief:'Return the maximum of every contiguous window of width k. Assume 1 ≤ k ≤ nums.size(). Target linear total time.',
 glossary:[['Deque','Double-ended queue: push/pop operations are available at both ends.'],['Monotonic deque','An index deque maintained so its corresponding values decrease from front to back.'],['Amortized analysis','Bounds total operations over a sequence, even when one individual update removes multiple elements.'],['Expired index','An index < i − k + 1 that falls outside the current window and must be removed.']],
 strategy:['Remove the front index if it is outside the current window.','While a back candidate is no larger than the current value, pop it; it cannot be the maximum of any future window containing the current index.','Append the current index; after k−1 positions, report nums[dq.front()].'],
 complexity:{time:'O(n)',space:'O(k)',why:'Every index is added once and removed at most once; the deque stores only candidates from the current window.'},
 invariant:{question:'What does the deque maintain?',choices:['Indices in descending order, values in ascending order','Increasing indices with strictly decreasing candidate values','All elements ever observed, including expired ones'],answer:1,explain:'Indices increase chronologically; candidates at the back with smaller/equal values are dominated.'},
 complexityOptions:['O(1)','O(log n)','O(n)','O(n log n)','O(n²)'],timeAnswer:2,spaceAnswer:5,spaceChoices:['O(1)','O(log n)','O(n)','O(n log n)','O(n²)','O(k)'],
 starter:`std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    // TODO: use std::deque<int> to store undominated indices.
    return {};
}`,
 reference:`std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::deque<int> dq;
    std::vector<int> out;
    for (int i=0;i<static_cast<int>(nums.size());++i) {
        while (!dq.empty() && dq.front()<=i-k)dq.pop_front();
        while (!dq.empty() && nums[dq.back()]<=nums[i])dq.pop_back();
        dq.push_back(i);
        if (i+1>=k)out.push_back(nums[dq.front()]);
    }
    return out;
}`,
 worked:{input:'nums = [1,3,−1,−3,5], k = 3',steps:[['i=0, 1','deque [0] values [1]'],['i=1, 3','pop smaller index 0 → deque [1]'],['i=2, −1','deque [1,2] → max 3'],['i=3, −3','deque [1,2,3] → max 3'],['i=4, 5','expire 1, pop 3 and 2 → [4] → max 5']]},
 proof:'Each deque index is within the current window, and values strictly decrease. A removed back candidate is dominated by the newer, at-least-as-large value which stays valid longer. Thus the front represents the maximum. Each index enters and exits at most once, implying O(n) total deque operations.',
 counterexample:'A naive nested scan is O(nk). Maintaining a heap works in O(n log n) but may carry stale entries; the monotonic deque achieves O(n).',
 followups:['Prove the sum of all pop operations is at most n.','Extend the technique to window minima and minimum-length subarrays.','Explain what changes for out-of-order streaming timestamps.']
},
{
 id:'merge-intervals',title:'Intervals, sorting, and inductive merging',unit:'04 / Greedy & sweep lines',minutes:35,level:'Medium',
 url:'https://leetcode.com/problems/merge-intervals/',
 contract:'std::vector<std::vector<int>> mergeIntervals(std::vector<std::vector<int>> a)',
 brief:'Merge overlapping closed integer intervals. Return the maximal merged intervals ordered by start. Every input has start ≤ end.',
 glossary:[['Closed interval [a,b]','Includes both endpoints; [1,3] and [3,5] overlap at 3.'],['Comparator','A function used by std::sort to establish the order of elements.'],['Greedy merge','Maintains the currently merged rightmost interval without revisiting earlier output.'],['Inductive invariant','All processed intervals are represented exactly by disjoint merged intervals in the output.']],
 strategy:['Sort intervals by starting endpoint, breaking ties by ending endpoint.','For each interval, extend the last output interval if its start ≤ the last output end; otherwise start a new block.','Return the maximal disjoint blocks.'],
 complexity:{time:'O(n log n)',space:'O(n)',why:'Sorting dominates; a linear scan follows. The returned output may contain n intervals (ignoring sort implementation scratch).'},
 invariant:{question:'After processing the first i sorted intervals, what is true?',choices:['Output intervals are disjoint and cover exactly their union','Output is always just one interval','Every interval has the same length'],answer:0,explain:'The algorithm merges whenever the next sorted interval intersects the last component; earlier components cannot be revisited.'},
 complexityOptions:['O(1)','O(log n)','O(n)','O(n log n)','O(n²)'],timeAnswer:3,spaceAnswer:2,
 starter:`std::vector<std::vector<int>> mergeIntervals(std::vector<std::vector<int>> a) {
    // TODO: sort by start; merge each interval into the last block.
    return a;
}`,
 reference:`std::vector<std::vector<int>> mergeIntervals(std::vector<std::vector<int>> a) {
    std::sort(a.begin(),a.end(),[](const auto& x,const auto& y){
        return x[0]<y[0] || (x[0]==y[0] && x[1]<y[1]);
    });
    std::vector<std::vector<int>> out;
    for (const auto& v:a) {
        if (out.empty() || v[0]>out.back()[1])out.push_back(v);
        else out.back()[1]=std::max(out.back()[1],v[1]);
    }
    return out;
}`,
 worked:{input:'[[8,10],[1,3],[2,6],[15,18]]',steps:[['Sort','[1,3], [2,6], [8,10], [15,18]'],['Process [1,3]','out = [[1,3]]'],['Process [2,6]','overlap → [[1,6]]'],['Process [8,10]','disjoint → [[1,6],[8,10]]'],['Process [15,18]','disjoint → 3 intervals']]},
 proof:'After sorting, any future interval starts no earlier than the current one. If it does not overlap the last merged interval, it cannot overlap any earlier finished output interval either. If it does, extending the right boundary exactly represents their union. By induction the output covers exactly all processed points in pairwise disjoint maximal blocks.',
 counterexample:'If intervals were half-open [a,b), [1,3) and [3,5) do not overlap, although unioning them into one interval may still be permitted by a different specification. State endpoint semantics.',
 followups:['Merge intervals online without resorting the entire history.','What if inputs arrive as a stream of sorted starts?','Define overlap rules for open/closed and infinite endpoints.']
},
{
 id:'coin-change',title:'Dynamic programming from a recurrence',unit:'05 / Dynamic programming',minutes:50,level:'Medium',
 url:'https://leetcode.com/problems/coin-change/',
 contract:'int coinChange(const std::vector<int>& coins, int amount)',
 brief:'Given strictly positive coin denominations with unlimited reuse, return the smallest number of coins needed for amount, or −1 if impossible. amount ≥ 0.',
 glossary:[['State','dp[a] represents the minimum number of coins to form exactly sum a.'],['Recurrence','dp[a] = 1 + min(dp[a−c]) over valid denominations c and reachable earlier amounts.'],['Sentinel','INF marks unreachable state; choose a value preventing overflow when adding one.'],['Bottom-up DP','Compute smaller sums before larger sums, so every dependency is already known.']],
 strategy:['Set dp[0]=0; initialize all positive sums to INF.','For each amount a and each coin c≤a, update dp[a] from dp[a−c] when reachable.','Return −1 if dp[amount] remains unreachable; otherwise its minimum.'],
 complexity:{time:'O(n·A)',space:'O(A)',why:'For A target amounts and n coin types, try each denomination; table stores A+1 entries.'},
 invariant:{question:'Why is dp[a−c] ready when computing dp[a]?',choices:['Coins are automatically sorted','Every coin c is positive, so a−c < a','Greedy always picks the largest coin'],answer:1,explain:'Strictly positive denominations make the dependency graph acyclic in increasing amounts.'},
 complexityOptions:['O(1)','O(log A)','O(A)','O(n·A)','O(A²)'],timeAnswer:3,spaceAnswer:2,
 starter:`int coinChange(const std::vector<int>& coins, int amount) {
    // TODO: dp[0] = 0; use a safe unreachable sentinel.
    return amount==0 ? 0 : -1;
}`,
 reference:`int coinChange(const std::vector<int>& coins, int amount) {
    const int INF=amount+1;
    std::vector<int> dp(amount+1,INF);
    dp[0]=0;
    for (int a=1;a<=amount;++a) {
        for (int c:coins) {
            if (c<=a && dp[a-c]!=INF)dp[a]=std::min(dp[a],dp[a-c]+1);
        }
    }
    return dp[amount]==INF?-1:dp[amount];
}`,
 worked:{input:'coins = [1,3,4], amount = 6',steps:[['dp[0]=0','base case'],['dp[1]=1','1'],['dp[2]=2','1+1'],['dp[3]=1','coin 3'],['dp[4]=1','coin 4'],['dp[5]=2','4+1'],['dp[6]=2','3+3 → optimal']]},
 proof:'For sum a, consider the last coin c in an optimal solution. The remaining coins must optimally form a−c; otherwise replacing the prefix would yield a better solution. Every possible last coin is examined, and all subproblems a−c have already been computed. Induction over a establishes dp[a] is optimal or unreachable.',
 counterexample:'Greedy fails for denominations [1,3,4] and amount 6: taking 4+1+1 uses three coins while 3+3 uses two.',
 followups:['Reconstruct the actual coin combination, not just its count.','Derive the bounded-quantity version where each denomination has limited inventory.','Explain when BFS over sums might be preferable to the table DP.']
},
{
 id:'lru-cache',title:'LRU caching with hash maps and linked lists',unit:'06 / Systems data structures',minutes:55,level:'Medium → Hard',
 url:'https://leetcode.com/problems/lru-cache/',
 contract:'class LRUCache { public: explicit LRUCache(int capacity); int get(int key); void put(int key,int value); };',
 brief:'Implement an LRU cache. Both get and put must be O(1) average. A successful get makes an entry most recently used; put updates or inserts and evicts the least recently used when full. Missing keys return −1. The educational variant permits capacity zero.',
 glossary:[['LRU','Least recently used: the entry least recently accessed is evicted first.'],['Doubly linked list','Each node stores previous and next references. A known node can be moved/removed in O(1).'],['std::list::splice','Moves an existing node in constant time without invalidating its iterator; unlike copying values and reallocating.'],['std::unordered_map','Maps a key to a list iterator for expected O(1) lookup; it does not itself preserve recency order.'],['Iterator invalidation','When an element is erased, its iterator becomes invalid. Remove the corresponding map entry before using it again.']],
 strategy:['Keep list order from most recent at front to least recent at back. Map keys to their list iterators.','get: find key; on hit move its node to front; return value.','put: update and move existing entries, or if full erase the back entry from map and list, then insert a new front entry. Handle capacity zero explicitly.'],
 complexity:{time:'O(1) average / operation',space:'O(C)',why:'Hash lookup is expected constant time and list splice/erase are constant time; storage is bounded by capacity C.'},
 invariant:{question:'What two structures must agree at every moment?',choices:['A heap and a sorted array','Map entries and exactly one list node per cached key, with list order reflecting recency','A list storing all keys ever accessed'],answer:1,explain:'The map ensures key lookup; the list ensures update of recency and selection of LRU victim. Their memberships must match.'},
 complexityOptions:['O(1) average / operation','O(log C) / operation','O(C) / operation','O(C log C) / operation'],timeAnswer:0,spaceAnswer:4,spaceChoices:['O(1)','O(log C)','O(n)','O(n log n)','O(C)'],
 starter:`class LRUCache {
public:
    explicit LRUCache(int capacity) { (void)capacity; }
    int get(int key) { (void)key; return -1; }
    void put(int key, int value) { (void)key; (void)value; }
};`,
 reference:`class LRUCache {
    int cap_;
    std::list<std::pair<int,int>> recent_;
    std::unordered_map<int,decltype(recent_)::iterator> where_;
public:
    explicit LRUCache(int capacity):cap_(capacity){}
    int get(int key) {
        auto it=where_.find(key);
        if (it==where_.end())return -1;
        recent_.splice(recent_.begin(),recent_,it->second);
        return it->second->second;
    }
    void put(int key,int value) {
        if (cap_<=0)return;
        auto it=where_.find(key);
        if (it!=where_.end()) {
            it->second->second=value;
            recent_.splice(recent_.begin(),recent_,it->second);
            return;
        }
        if (static_cast<int>(recent_.size())==cap_) {
            where_.erase(recent_.back().first);
            recent_.pop_back();
        }
        recent_.push_front({key,value});
        where_[key]=recent_.begin();
    }
};`,
 worked:{input:'capacity=2; put(1,10); put(2,20); get(1); put(3,30)',steps:[['put(1,10)','recent [1]'],['put(2,20)','recent [2,1]'],['get(1)=10','recent [1,2]'],['put(3,30)','evict 2; recent [3,1]']]},
 proof:'Invariant: list contains exactly the map keys, each mapped iterator points to its node, and order from front to back reflects last successful access. Every operation maintains both membership and order. When inserting at capacity, the back is by definition least recently used. Hash lookup is expected O(1); std::list splice and removal of an iterator are O(1).',
 counterexample:'Treating −1 as an absent sentinel is wrong for stored values: put(7,−1) still means key 7 exists and its get should refresh recency. Determine existence from the hash map, not the returned value.',
 followups:['Replace LRU with LFU and discuss required metadata.','Discuss thread safety and the trade-off between a global mutex and sharded caches.','Describe cache stampede and why this in-memory LRU does not solve it.']
}
];

const IX_COMMON_COMPLEXITY=['O(1)','O(log n)','O(n)','O(n log n)','O(n²)'];
function ixRandom(seed){let x=seed|0||1234567;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};}
function ixInt(r,a,b){return a+Math.floor(r()*(b-a+1));}
function ixCoinOracle(coins,A){const dp=Array(A+1).fill(A+1);dp[0]=0;for(let i=1;i<=A;i++)for(const c of coins)if(c<=i)dp[i]=Math.min(dp[i],dp[i-c]+1);return dp[A]>A?-1:dp[A];}
function ixMergeOracle(a){const s=a.map(x=>x.slice()).sort((x,y)=>x[0]-y[0]||x[1]-y[1]);const out=[];for(const item of s){if(!out.length||item[0]>out[out.length-1][1])out.push(item);else out[out.length-1][1]=Math.max(out[out.length-1][1],item[1]);}return out;}
function ixLRUOracle(cap,ops){const m=new Map(),out=[];for(const op of ops){const k=op[1];if(op[0]===0){if(!m.has(k)){out.push(-1);continue;}const v=m.get(k);m.delete(k);m.set(k,v);out.push(v);}else if(cap>0){m.delete(k);if(m.size>=cap)m.delete(m.keys().next().value);m.set(k,op[2]);}}return out;}
function ixCaseData(id,seed){const r=ixRandom(seed*1664525+1013904223),cases=[];
 const add=(name,args,expected)=>cases.push({name,args,expected});
 if(id==='valid-parentheses'){
  for(const s of ['','()','([]{})','([)]','(((','{[()]}','())','{','(((())))','[]{}()','[{]}','[[]]'])add('boundary '+JSON.stringify(s),[s],ixValid(s));
  const chars='()[]{}';for(let i=0;i<22;i++){let s='';const n=ixInt(r,0,46);for(let j=0;j<n;j++)s+=chars[ixInt(r,0,5)];add('seeded string '+i,[s],ixValid(s));}
 }else if(id==='binary-search'){
  add('empty',[[],8],-1);add('singleton hit',[[5],5],0);add('singleton miss',[[5],2],-1);
  for(let i=0;i<27;i++){const n=ixInt(r,1,60),a=[...new Set(Array.from({length:n},()=>ixInt(r,-300,300)))].sort((a,b)=>a-b);const v=r()<.6?a[ixInt(r,0,a.length-1)]:ixInt(r,-320,320);add('seeded sorted '+i,[a,v],a.indexOf(v));}
 }else if(id==='sliding-window-maximum'){
  add('classic',[[1,3,-1,-3,5,3,6,7],3],[3,3,5,5,6,7]);add('one element',[[7],1],[7]);
  for(let i=0;i<25;i++){const n=ixInt(r,1,70),a=Array.from({length:n},()=>ixInt(r,-200,200)),k=ixInt(r,1,n);add('seeded window '+i,[a,k],Array.from({length:n-k+1},(_,j)=>Math.max(...a.slice(j,j+k))));}
 }else if(id==='merge-intervals'){
  add('classic',[[[1,3],[2,6],[8,10],[15,18]]],[[1,6],[8,10],[15,18]]);add('touching ends',[[[1,3],[3,5]]],[[1,5]]);add('empty',[[]],[]);
  for(let i=0;i<25;i++){const n=ixInt(r,0,15),a=Array.from({length:n},()=>{const s=ixInt(r,-40,40);return [s,s+ixInt(r,0,18)];});add('seeded intervals '+i,[a],ixMergeOracle(a));}
 }else if(id==='coin-change'){
  add('unreachable',[[2],3],-1);add('zero amount',[[1,2,5],0],0);add('greedy trap',[[1,3,4],6],2);
  for(let i=0;i<25;i++){const n=ixInt(r,1,7),coins=[...new Set(Array.from({length:n},()=>ixInt(r,1,17)))],A=ixInt(r,0,115);add('seeded sums '+i,[coins,A],ixCoinOracle(coins,A));}
 }else if(id==='lru-cache'){
  add('classic eviction',[2,[[1,1,1],[1,2,2],[0,1],[1,3,3],[0,2],[0,1],[0,3]]],[1,-1,1,3]);
  add('capacity zero',[0,[[1,1,-1],[0,1],[1,2,2],[0,2]]],[-1,-1]);
  add('stored negative one',[2,[[1,7,-1],[1,8,8],[0,7],[1,9,9],[0,8],[0,7]]],[-1,-1,-1]);
  for(let i=0;i<24;i++){const cap=ixInt(r,0,5),ops=[];for(let j=0,n=ixInt(r,12,55);j<n;j++){const k=ixInt(r,0,11);ops.push(r()<.53?[1,k,ixInt(r,-5,30)]:[0,k]);}add('seeded LRU '+i,[cap,ops],ixLRUOracle(cap,ops));}
 }
 return cases;
}
function ixValid(s){const st=[],matches={')':'(',']':'[','}':'{'};for(const c of s){if(c==='('||c==='['||c==='{')st.push(c);else if(st.pop()!==matches[c])return false;}return !st.length;}
function ixLit(v){if(Array.isArray(v))return '{'+v.map(ixLit).join(',')+'}';if(typeof v==='boolean')return v?'true':'false';if(typeof v==='string')return JSON.stringify(v);return String(v);}
function ixCppCase(id,c,i){const a=c.args, expected=c.expected;
 let call;
 if(id==='valid-parentheses')call=`isValid(std::string(${ixLit(a[0])})) == ${ixLit(expected)}`;
 if(id==='binary-search')call=`searchIndex(std::vector<int>${ixLit(a[0])},${a[1]}) == ${expected}`;
 if(id==='sliding-window-maximum')call=`maxSlidingWindow(std::vector<int>${ixLit(a[0])},${a[1]}) == std::vector<int>${ixLit(expected)}`;
 if(id==='merge-intervals')call=`mergeIntervals(std::vector<std::vector<int>>${ixLit(a[0])}) == std::vector<std::vector<int>>${ixLit(expected)}`;
 if(id==='coin-change')call=`coinChange(std::vector<int>${ixLit(a[0])},${a[1]}) == ${expected}`;
 if(id==='lru-cache')call=`ixRunLRU(${a[0]},std::vector<std::vector<int>>${ixLit(a[1])}) == std::vector<int>${ixLit(expected)}`;
 if(!call)throw Error('Unsupported lab '+id);
 return `ixCheck(${i+1}, ${call});`;
}
const IX_PREAMBLE=`#include <algorithm>\n#include <climits>\n#include <cstdint>\n#include <deque>\n#include <iostream>\n#include <list>\n#include <map>\n#include <numeric>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <utility>\n#include <vector>\n`;
const IX_HELPER=`
std::vector<int> ixRunLRU(int cap,const std::vector<std::vector<int>>& ops){
    LRUCache cache(cap);
    std::vector<int> out;
    for(const auto& op:ops){if(op[0]==1)cache.put(op[1],op[2]);else out.push_back(cache.get(op[1]));}
    return out;
}
`;
function ixBuildSource(lesson,body,seed){
 const cases=ixCaseData(lesson.id,seed);
 const check=cases.map((c,i)=>ixCppCase(lesson.id,c,i)).join('\n');
 return `${IX_PREAMBLE}\n${body}\n${lesson.id==='lru-cache'?IX_HELPER:''}\nint main(){\nint passed=0;\nauto ixCheck=[&](int i,bool ok){std::cout<<"IX_CASE|"<<i<<"|"<<(ok?"PASS":"FAIL")<<"\\n";if(ok)++passed;};\n${check}\nstd::cout<<"IX_TOTAL|"<<passed<<"|"<<${cases.length}<<"\\n";\nreturn passed==${cases.length}?0:1;\n}`;
}
if(typeof module!=='undefined')module.exports={IX_LESSONS,ixBuildSource,ixCaseData,ixCppCase};