/* Phase XIV-A/B — original storyboard data. Each frame is one verifiable state transition.
 * SVG scenes are generated from these states, not screenshots of third-party textbooks. */
(function(root){
'use strict';
const S=(id,kind,title,purpose,frames,challenge,source)=>({id,kind,title,purpose,frames,challenge,source});
const F=(label,explain,state)=>({label,explain,...state});
const scenes=[
S('c0-state','bindings','Names and objects are different things',
 'Predict whether rebinding or mutation changes what another name sees.',
 [
 F('A name is bound to an integer','Assignment makes x refer to the integer object 2. The equals sign here is binding, not a persistent equation.',{names:[['x','i2']],objects:[['i2','2','integer']]}),
 F('Two names, one immutable value','y receives the same reference. No copy is necessary for the immutable integer; neither name has a mutable cell to modify.',{names:[['x','i2'],['y','i2']],objects:[['i2','2','integer']]}),
 F('Rebinding does not rewrite y','x = x + 1 evaluates 3, then binds x to another integer. y still refers to 2.',{names:[['x','i3'],['y','i2']],objects:[['i2','2','integer'],['i3','3','integer']]}),
 F('Now create a mutable list','a and b both refer to a single list object, containing [2].',{names:[['a','L'],['b','L']],objects:[['L','[2]','list']]}),
 F('Mutation is visible through both names','a.append(3) changes the shared list object; reading b now sees [2, 3].',{names:[['a','L'],['b','L']],objects:[['L','[2, 3]','list']]}),
 ],{question:'After a=[2]; b=a; a.append(3), what does b contain?',options:['[2]','[2, 3]','A separate copy'],answer:1,why:'append modifies the object both names reference. Rebinding a to a new list would not modify b.'},'Python language tutorial · objects and assignment'),
S('c0-contract','contract','Build an exact function contract',
 'A vague programming task becomes answerable when boundaries and failure cases are explicit.',
 [
 F('Specify valid inputs','sum_positive expects a finite sequence of integers; the operation must not silently assume nonempty input.',{active:'Input',values:{Input:'Finite integer sequence',Output:'?',Empty:'?',Mutation:'?',Bound:'?'}}),
 F('Specify output and edge behavior','Output is an integer sum of strictly positive elements. Negative values and zero contribute nothing.',{active:'Output',values:{Input:'Finite integer sequence',Output:'Integer: sum(max(x,0))',Empty:'?',Mutation:'?',Bound:'?'}}),
 F('Prove the empty case','The empty sum is 0, and a list of only nonpositive integers also produces 0.',{active:'Empty',values:{Input:'Finite integer sequence',Output:'Integer: sum of positives',Empty:'[] → 0',Mutation:'?',Bound:'?'}}),
 F('State side effects','The input list is never mutated. Two calls with the same input return the same result.',{active:'Mutation',values:{Input:'Finite integer sequence',Output:'Integer: sum of positives',Empty:'[] → 0',Mutation:'Never modify input',Bound:'?'}}),
 F('Set a realistic complexity target','One scan and one accumulator suffice: O(n) time, O(1) auxiliary memory. Now the specification is testable.',{active:'Bound',values:{Input:'Finite integer sequence',Output:'Integer: sum of positives',Empty:'[] → 0',Mutation:'Never modify input',Bound:'O(n) / O(1) aux'}}),
 ],{question:'Which missing field most directly changes whether a function is correct for []?',options:['Font choice','Empty-input behavior','The company that asks it'],answer:1,why:'The contract must specify what should happen for every valid boundary input, including an empty list.'},'Harvard CS50P · program contracts'),
S('c0-edge','compare','One counterexample breaks a universal claim',
 'Compare an incorrect shortcut with a specification-compliant initialization.',
 [
 F('The incorrect shortcut','Algorithm initializes best = 0 when finding the maximum sum of a nonempty fixed-length window.',{input:'values = [-1], k = 1',wrong:'best = 0',right:'Best must be a valid window',active:'wrong'}),
 F('The smallest distinguishing input','There is exactly one valid length-1 window, containing -1. Its sum is -1.',{input:'only window = [-1]',wrong:'reports 0',right:'true sum = -1',active:'input'}),
 F('Observe the contradiction','The flawed answer 0 does not correspond to any permitted window, so the claimed algorithm fails.',{input:'contract: choose a real window',wrong:'0  ✕ invalid',right:'-1  ✓ valid',active:'wrong'}),
 F('Repair the invariant','Initialize best to the sum of the first valid window, even if negative. Then compare later valid windows.',{input:'initial = sum(values[:k])',wrong:'best = 0  ✕',right:'best = -1  ✓',active:'right'}),
 ],{question:'Which input alone refutes “best=0 works for every nonempty window task”?',options:['[5], k=1','[-1], k=1','[0], k=1'],answer:1,why:'When the only valid window sums to -1, zero is not a feasible answer.'},'MIT 6.006 · adversarial test cases and invariants'),
S('c0-recall','flow','Recognition is not retrieval or transfer',
 'Use the same mental model across the three stages of independent competence.',
 [
 F('Recognize an example','You can follow a worked example while the solution is visible. This is useful exposure, not proof of mastery.',{nodes:['Recognition','Retrieval','Transfer'],active:0,foot:'Read and annotate the worked example'}),
 F('Reconstruct without notes','Close the solution. Rebuild the key algorithm and write its invariant from memory.',{nodes:['Recognition','Retrieval','Transfer'],active:1,foot:'Derive, write, and test unaided'}),
 F('Change the contract','Apply the same idea to a new question with a modified input/output contract.',{nodes:['Recognition','Retrieval','Transfer'],active:2,foot:'Solve an unfamiliar variant and defend assumptions'}),
 F('Revisit after a delay','Repeat after a day or more. Keep a failed attempt visible rather than collecting streaks.',{nodes:['Recognition','Retrieval','Transfer'],active:2,foot:'Delayed independent practice reveals gaps'}),
 ],{question:'What is stronger evidence of mastery than recognizing a familiar solution?',options:['Longer time on page','An independent solution to a changed contract','Checking all topic boxes'],answer:1,why:'Retrieving the algorithm and transferring its invariant to an unfamiliar task tests understanding.'},'MIT problem sets · retrieval and transfer'),
S('c1-values','bindings','A shallow copy still shares inner objects',
 'Distinguish copying a container from copying the mutable objects it references.',
 [
 F('Two names initially alias one outer list','x and y refer to the same list containing a nested list.',{names:[['x','outerA'],['y','outerA']],objects:[['outerA','[ inner ]','list','inner'],['inner','[1]','list']]}),
 F('Copy only the outer container','y = x.copy() creates a new outer list, but both outer lists still point at the same nested list.',{names:[['x','outerA'],['y','outerB']],objects:[['outerA','[ inner ]','list','inner'],['outerB','[ inner ]','list','inner'],['inner','[1]','list']]}),
 F('Change the shared inner list','x[0].append(2) mutates the nested list once. y[0] observes that mutation.',{names:[['x','outerA'],['y','outerB']],objects:[['outerA','[ inner ]','list','inner'],['outerB','[ inner ]','list','inner'],['inner','[1, 2]','list']]}),
 F('Only a deep copy separates nested lists','For this example, copy.deepcopy(x) can produce independent outer and inner containers; a shallow copy alone cannot.',{names:[['x','outerA'],['y','outerC']],objects:[['outerA','[ inner ]','list','inner'],['outerC','[ inner2 ]','list','inner2'],['inner','[1, 2]','list'],['inner2','[1, 2]','list']]}),
 ],{question:'After y=x.copy() on x=[[1]], what happens to y when x[0].append(2)?',options:['y stays [[1]]','y becomes [[1,2]]','y becomes [1,2]'],answer:1,why:'Only the outer list is copied; x[0] and y[0] still reference the same inner list.'},'Python language tutorial · mutable containers'),
S('c1-control','flow','A generator streams; a list materializes',
 'Study space usage and when elements are constructed, without claiming that generators are always faster.',
 [
 F('List comprehension allocates all results','[f(x) for x in data] constructs and retains an output list before a downstream sum reads it.',{nodes:['Input stream','Build full list','Consume result'],active:1,foot:'O(n) extra list references for n outputs'}),
 F('Generator expression produces on demand','(f(x) for x in data) creates an iterator. When consumed, each value can be processed without storing an output list.',{nodes:['Input stream','Yield one value','Accumulate'],active:1,foot:'O(1) extra output buffering for simple streaming use'}),
 F('Consumption drives the computation','sum(f(x) for x in data) requests values in sequence; a generator is not a separate thread.',{nodes:['Next input','Compute f(x)','Update total'],active:2,foot:'The underlying source and f(x) may have additional memory costs'}),
 F('Choose by actual downstream needs','If random access or repeated passes are required, a materialized list might be appropriate. If one-pass aggregation suffices, stream.',{nodes:['Workload','Access pattern','Choose form'],active:2,foot:'Memory-vs-reuse is the trade-off—not a universal speed ranking'}),
 ],{question:'Which expression avoids building a separate intermediate list for a one-pass sum?',options:['sum([f(x) for x in data])','sum(f(x) for x in data)','list(f(x) for x in data)'],answer:1,why:'A generator feeds values lazily into sum; a bracketed list comprehension retains all results.'},'Harvard CS50P · Python iterable patterns'),
S('c1-functions','bindings','Mutable defaults live across calls',
 'Trace when the default object is allocated and why later calls may share state.',
 [
 F('The function is defined','def add(x, seen=[]) creates a default list once, at function definition time.',{names:[['default','L']],objects:[['L','[]','list']]}),
 F('First call modifies the default','add(1) appends 1 to the default list allocated when the function was defined; that list is reused on subsequent calls.',{names:[['default','L'],['call 1','L']],objects:[['L','[1]','list']]}),
 F('Second call reuses that list','add(2) appends to the already-populated default; the result is [1, 2], not [2].',{names:[['default','L'],['call 1','L'],['call 2','L']],objects:[['L','[1, 2]','list']]}),
 F('Repair the function signature','Use def add(x, seen=None) and create a list inside when seen is None. Each omitted argument gets a fresh list.',{names:[['call 1','A'],['call 2','B']],objects:[['A','[1]','list'],['B','[2]','list']]}),
 ],{question:'When is a Python default argument expression evaluated?',options:['Every call','At function definition','Every return'],answer:1,why:'The default list is created once when the function is defined, so mutations carry into later calls.'},'Official Python tutorial · default parameter values'),
S('c1-objects','flow','A generator is a suspended iterator',
 'Follow the life cycle of an iterator and notice when values are actually produced.',
 [
 F('Construct the generator object','Calling a generator function returns an iterator object; the body has not yet yielded an item.',{nodes:['Call generator()','Paused object','No item yet'],active:1,foot:'Creating a generator is not the same as running it to completion'}),
 F('The first next resumes execution','next(g) runs until yield returns the first event and suspends at that point.',{nodes:['next(g)','yield event A','Paused'],active:1,foot:'Only the requested event needs to be produced'}),
 F('A second request continues','next(g) resumes after the last yield and produces event B.',{nodes:['next(g)','yield event B','Paused'],active:1,foot:'Local state persists between yields'}),
 F('An exhausted generator remains exhausted','After all values are yielded, a further next(g) raises StopIteration; restarting generally requires constructing a new iterator.',{nodes:['No events left','StopIteration','Create new g'],active:1,foot:'A consumed generator does not automatically rewind'}),
 ],{question:'What happens when you iterate the same exhausted generator again?',options:['It automatically restarts','It yields no further items','It returns the last item forever'],answer:1,why:'The iterator keeps its exhausted state; construct another generator if you need a new pass.'},'Python docs · generators and iterators'),
S('c1-exceptions','flow','A context manager releases resources on failure',
 'Visualize the guarantee of with even when work fails partway through.',
 [
 F('Enter the managed scope','with resource as handle calls its enter logic; the resource is now acquired.',{nodes:['Enter scope','Resource open','Run body'],active:0,foot:'The context manager owns the exit step'}),
 F('An operation raises an error','A parse failure interrupts the body. Returning fabricated success would conceal a data-quality defect.',{nodes:['Parse record','Exception','Exit handler'],active:1,foot:'Work did not finish successfully'}),
 F('Cleanup still executes','The manager’s exit logic runs whether the body succeeds or raises; for files it normally closes the handle.',{nodes:['Exception','__exit__ / close','No leaked handle'],active:1,foot:'Cleanup is separate from error recovery'}),
 F('Errors can still propagate','Unless the context manager explicitly suppresses it, the original exception continues outward for correct handling.',{nodes:['Cleanup done','Propagate error','Caller decides'],active:2,foot:'Resource safety does not mean silently swallowing failure'}),
 ],{question:'What does a context manager guarantee in this scenario?',options:['Parsing is always correct','Exit/cleanup runs even if an exception occurs','The operation automatically retries'],answer:1,why:'The with statement invokes exit logic on normal and exceptional exit; the exception may still propagate.'},'Official Python tutorial · with and exceptions'),
S('c2-growth','capacity','Occasional resizing can still be amortized O(1)',
 'See why a costly individual append does not imply a costly sequence of appends.',
 [
 F('Capacity one','Append the first element to the initially allocated slot. There are no existing elements to copy during this step.',{capacity:1,used:1,copied:0,totalCopies:0}),
 F('Expand to two','Before appending item 2, allocate capacity 2 and copy the 1 existing element.',{capacity:2,used:2,copied:1,totalCopies:1}),
 F('Expand to four','Before appending item 3, copy the 2 existing elements into capacity 4.',{capacity:4,used:3,copied:2,totalCopies:3}),
 F('Reuse spare capacity','Append item 4 without resizing; the existing capacity of 4 is enough.',{capacity:4,used:4,copied:0,totalCopies:3}),
 F('Expand to eight','Append item 5 after copying 4 earlier elements. Total copies 1+2+4=7 for five appends.',{capacity:8,used:5,copied:4,totalCopies:7}),
 ],{question:'What is the amortized append bound when dynamic-array capacity doubles as needed?',options:['O(n) per append amortized','O(1) amortized','O(n²) amortized'],answer:1,why:'The geometric sequence of reallocation copies is O(n) over n appends even though one append may cost O(n).'},'MIT 6.006 · amortized analysis'),
S('c2-hash','hash','Build a frequency table one event at a time',
 'The dictionary must summarize exactly the prefix processed so far.',
 [
 F('Nothing has arrived yet','Before the stream, counts is empty. The invariant holds for the empty prefix.',{events:['A','B','A'],processed:0,counts:{}}),
 F('Read the first A','Set counts[A]=1. The processed prefix contains exactly one A, so the dictionary invariant holds.',{events:['A','B','A'],processed:1,counts:{A:1}}),
 F('Read B','Set counts[B]=1 without changing the count of A. Each key records its own frequency in the processed prefix.',{events:['A','B','A'],processed:2,counts:{A:1,B:1}}),
 F('Read another A','Increment counts[A] from 1 to 2. The sum of all counts is the number of processed events.',{events:['A','B','A'],processed:3,counts:{A:2,B:1}}),
 ],{question:'After processing [A,B,A], what is counts[A]?',options:['1','2','3'],answer:1,why:'The prefix contains two A events; a set of symbols would lose this multiplicity.'},'Open Data Structures · hash tables'),
S('c2-windows','window','A sliding window updates in constant work',
 'Track a fixed-size interval, its outgoing and incoming value, and the best observed sum.',
 [
 F('First window','Initialize sum from the first k=2 elements: 1+2=3; best begins at a valid window.',{values:[1,2,3,4],k:2,left:0,total:3,best:3,out:null,in:null}),
 F('Slide one position','Remove outgoing 1 and add incoming 3. Sum becomes 3−1+3=5; best becomes 5.',{values:[1,2,3,4],k:2,left:1,total:5,best:5,out:1,in:3}),
 F('Slide again','Remove outgoing 2 and add incoming 4. Sum becomes 5−2+4=7; best becomes 7.',{values:[1,2,3,4],k:2,left:2,total:7,best:7,out:2,in:4}),
 ],{question:'For values [1,2,3,4], k=2, which maximum contiguous-window sum is correct?',options:['10','7','6'],answer:1,why:'The valid windows sum to 3, 5 and 7. The best is 7, not the total of the array.'},'MIT 6.006 · sequence algorithms'),
S('c2-binary','binary','Lower bound keeps the first valid index',
 'Maintain a half-open interval containing the first index satisfying the predicate.',
 [
 F('Start with all candidates','Search [lo, hi) = [0,5), target 2. Midpoint 2 satisfies nums[mid] ≥ 2, so it cannot be discarded.',{values:[1,2,2,2,5],target:2,lo:0,hi:5,mid:2,result:null}),
 F('Keep the left half including mid','Set hi=2. Midpoint 1 also satisfies the predicate, so keep it and what precedes it.',{values:[1,2,2,2,5],target:2,lo:0,hi:2,mid:1,result:null}),
 F('Discard only values strictly below target','Now mid=0 has value 1 below target 2, so this position and every earlier position fail the predicate. Move lo to 1.',{values:[1,2,2,2,5],target:2,lo:0,hi:1,mid:0,result:null}),
 F('The transition is at index 1','lo=hi=1. Verify nums[1] is target; return first index 1, not the first encountered midpoint.',{values:[1,2,2,2,5],target:2,lo:1,hi:1,mid:null,result:1}),
 ],{question:'With [1,2,2,2,5] and target 2, what is the first matching index?',options:['2','1','3'],answer:1,why:'Lower bound searches for the first position satisfying nums[i] ≥ 2, and then verifies equality.'},'MIT 6.006 · binary search invariants'),
S('c2-structures','bfs','FIFO exploration preserves shortest paths',
 'Observe the frontier and the first discovered distance for each node.',
 [
 F('Discover the start','Enqueue A with hop distance 0. No other vertices are discovered.',{queue:['A'],visited:[],distance:{A:0},active:'A'}),
 F('Expand A','Dequeue A, enqueue its neighbors B and C with distance 1.',{queue:['B','C'],visited:['A'],distance:{A:0,B:1,C:1},active:'A'}),
 F('Expand B','Dequeue B. Discover D at distance 2 and place it after C in the FIFO queue.',{queue:['C','D'],visited:['A','B'],distance:{A:0,B:1,C:1,D:2},active:'B'}),
 F('Expand C','C also points to D, but D was marked on enqueue. Do not insert it again or overwrite its distance.',{queue:['D'],visited:['A','B','C'],distance:{A:0,B:1,C:1,D:2},active:'C'}),
 F('Finish at D','After processing D, queue is empty. Shortest hop distances are A:0, B:1, C:1, D:2.',{queue:[],visited:['A','B','C','D'],distance:{A:0,B:1,C:1,D:2},active:'D'}),
 ],{question:'Why is D recorded with distance 2, not 3, after exploration?',options:['Because B is alphabetically first','FIFO processes vertices in nondecreasing hop distance','Because the graph is sorted'],answer:1,why:'Every newly discovered neighbor is enqueued at its parent distance plus one, preserving BFS layers.'},'Open Data Structures · graph traversal'),
S('c2-graphs','dp','DP combines smaller solved subproblems',
 'Count unordered combinations for amounts up to 5 with coin denominations [1, 2, 5].',
 [
 F('Base case: make amount zero','There is exactly one way to make amount 0 using no coins—the empty selection.',{coins:[],dp:[1,0,0,0,0,0],focus:0}),
 F('Allow coin 1','Every amount 0..5 can be made in exactly one way using only ones.',{coins:[1],dp:[1,1,1,1,1,1],focus:1}),
 F('Add coin 2','Update amounts ascending: dp[s] += dp[s−2]. The result is [1,1,2,2,3,3].',{coins:[1,2],dp:[1,1,2,2,3,3],focus:4}),
 F('Add coin 5','Only amount 5 gains one extra combination using a 5 coin. Now dp[5]=4.',{coins:[1,2,5],dp:[1,1,2,2,3,4],focus:5}),
 ],{question:'Using unlimited [1,2,5] coins, how many unordered combinations make amount 5?',options:['3','4','5'],answer:1,why:'The four unordered combinations are 1+1+1+1+1, 2+1+1+1, 2+2+1, and 5. Reordering does not create new combinations.'},'MIT 6.006 · dynamic programming'),
];
const mathAddon=root.MasteryMathVisuals||(typeof module!=='undefined'&&require('./visual-math.js'));
if(!mathAddon||!mathAddon.validate())throw Error('Missing exact math visual models');
scenes.push(...mathAddon.scenes);
function validate(){
 const ids=new Set();
 for(const s of scenes){
  if(ids.has(s.id))throw Error('Duplicated visual '+s.id);
  ids.add(s.id);
  if(s.frames.length<3||!s.title||!s.purpose||!s.source)throw Error('Missing teaching material '+s.id);
  for(const f of s.frames)if(!f.label||f.explain.length<55)throw Error('Weak frame '+s.id);
  const q=s.challenge;
  if(!q||q.options.length!==3||q.answer<0||q.answer>2||q.why.length<55)throw Error('Missing prediction '+s.id);
 }
 return true;
}
const lookup=id=>scenes.find(s=>s.id===id)||null;
const api={scenes,lookup,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryVisualScenes=api;
})(typeof window!=='undefined'?window:globalThis);