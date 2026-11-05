/* Stage exit checks are original scenarios distinct from lesson quick-checks.
  Browser-visible and finite; they evaluate recognition, not general proof mastery. */
(function(root){'use strict';
const Q=(prompt,answers,correct,why)=>({prompt,answers,correct,why});
const exams={
C0:[
 Q('After a=[1]; b=a; a=a+[2], what is b?', ['[1,2]','[1]','[]','Error'],1,'a=a+[2] creates a new list and rebinds a; b still references the original [1].'),
 Q('A specification says “return an average” but not how to handle []. What should you do first?', ['Pick zero without discussion','Ask or define the empty-input contract','Choose a faster sort','Assume input is never empty'],1,'An undefined edge case must be resolved in the contract before declaring the implementation correct.'),
 Q('A fixed-window maximizer uses best=0. What is the smallest revealing failure?', ['[5], k=1','[0], k=1','[-1], k=1','[3,4], k=2'],2,'The only window sums to −1, but best initialized to zero would report zero.'),
 Q('Which is the strongest sign you can transfer an algorithm?', ['Recognize the source URL','Memorize the original code','Solve a changed contract without looking and explain the invariant','Check every lesson box'],2,'Unseen transfer combined with a defensible invariant is stronger evidence than recognition.')
],
C1:[
 Q('A function uses def f(x, items=[]). Why might the list grow between calls?', ['The function is recursively called','Default list is reused from function definition','Python automatically caches output','The variable x is mutable'],1,'Mutable default objects persist across calls.'),
 Q('To process a 10-million-record stream without materializing it, prefer...', ['list(generator)','A generator consumed incrementally','Repeated slicing of the whole stream','Making a second complete copy'],1,'Generators produce values lazily; a list retains all references.'),
 Q('Which approach preserves error diagnostics when opening and parsing a file?', ['except Exception: return []','Use with and propagate or precisely handle parse failures','Ignore a malformed row silently','Return a success flag after any exception'],1,'Resource cleanup plus meaningful error semantics supports reliability.'),
 Q('Which is an accurate statement about Python dict membership?', ['Always O(1) for every possible input','Typically expected O(1), with potential adversarial worst cases','Always O(n log n)','Each dict membership sorts the keys'],1,'Expected hashing cost is normally constant; worst-case collision behavior matters.')
],
C2:[
 Q('With duplicates [2,2,2] and target 2, correct lower-bound binary search returns...', ['Index 2','Index 1','Index 0','−1'],2,'The first index satisfying nums[i] >= 2 is zero.'),
 Q('What preserves O(n) total work across adjacent fixed-size window sums?', ['Recalculate every window from scratch','Add entering value and subtract leaving value','Sort every window','Use a nested loop for each right endpoint'],1,'Only two elements change per step, so each window update is O(1).'),
 Q('Why does a FIFO queue guarantee shortest paths in an unweighted graph?', ['It sorts nodes lexicographically','It explores by nondecreasing hop count','It repeatedly chooses the minimum edge weight','It eliminates cycles from the graph'],1,'FIFO processes layers in BFS order; distance increases by exactly one per discovered edge.'),
 Q('If a dynamic array doubles capacity when full, what is the usual amortized append bound?', ['O(n) per append amortized','O(log n)','O(1) amortized','O(n²)'],2,'Geometrically increasing capacities produce O(n) total copying over n appends.')
],
C3:[
 Q('A condition is rare (1%) and a test has 90% sensitivity with 10% false positives. Positive predictive value is about...', ['90%','50%','8.33%','1%'],2,'Bayes gives 0.009/(0.009+0.099) ≈ 0.0833. The denominator includes false positives from the much larger unaffected group.'),
 Q('For dependent finite-expectation X and Y, which is necessarily true?', ['E[X+Y]=E[X]+E[Y]','E[XY]=E[X]E[Y]','Var(X+Y)=Var(X)+Var(Y)','Cov(X,Y)=0'],0,'Linearity of expectation does not require independence.'),
 Q('For independent Bernoulli samples, what happens to the sample-mean standard error when n grows from 100 to 400?', ['It doubles','It halves','It quadruples','It stays the same'],1,'Standard error scales as 1/sqrt(n); quadrupling n halves it.'),
 Q('For L(w)=(wx−y)² with w=1, x=2, y=4, gradient is...', ['−8','−2','4','8'],0,'dL/dw=2(wx−y)x=2(2−4)2=−8. Differentiate the squared residual with the chain rule before updating w.')
],
C4:[
 Q('A create request times out after the server commits. Which is safest?', ['Send a new request with a new ID each time','Retry using a stable idempotency key and recorded result','Assume the server never committed','Silently ignore all future requests'],1,'An idempotency key allows replay-safe retries after unknown outcomes.'),
 Q('A database transfer debits an account but the process crashes before crediting the other. Which mechanism addresses that partial side effect?', ['A covering index','An atomic transaction','A faster JSON parser','A bigger thread pool'],1,'Atomicity commits both debit and credit or neither.'),
 Q('An input parser reports 2 million frames/s. Which cannot be inferred from that metric alone?', ['It has a throughput measurement','It processed frames in a timed interval','Its p99 individual order-update latency','Its tested workload size'],2,'Throughput does not determine tail latency or the cost of individual order-book updates.'),
 Q('A generated property test asserts sum(counts.values())==len(events). Which defect could still pass?', ['Dropped events','Counting some symbols under the wrong key','An extra counted event','Returning an empty map for nonempty input'],1,'A key swap preserves the total while violating the mapping contract.')
]
};
function validate(){for(const [k,v] of Object.entries(exams)){if(!/^C[0-4]$/.test(k)||v.length!==4)throw Error('Exam size '+k);for(const q of v)if(q.answers.length!==4||q.correct<0||q.correct>3||!q.why||!q.prompt)throw Error('Invalid exam');}return Object.keys(exams).length===5;}
const api={exams,validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MasteryFoundationExams=api;
})(typeof window!=='undefined'?window:globalThis);
