/* Deterministic, fixed-reference traces for teaching state transitions.
   These are NOT instrumented captures of the learner's compiled program. */
'use strict';
const CPP_REFERENCE_TRACES={
 'two-sum':[
  {title:'Initial state',detail:'Target = 9. No values have been seen.',kind:'hash',items:[2,7,11,15],i:-1,seen:[]},
  {title:'Process i = 0',detail:'Need 9 − 2 = 7. The map has no 7, so save value 2 at index 0.',kind:'hash',items:[2,7,11,15],i:0,seen:[['2',0]]},
  {title:'Process i = 1',detail:'Need 9 − 7 = 2. The map contains 2 at index 0: return [0,1].',kind:'hash',items:[2,7,11,15],i:1,seen:[['2',0]],answer:'[0,1]'}
 ],
 'linked-list':[
  {title:'Start',detail:'prev = nullptr, curr points to the first node. No edges have yet been changed.',kind:'list',links:[1,2,-1],prev:-1,curr:0,next:1},
  {title:'Reverse the first edge',detail:'Save next = curr->next (node 27), then set node 12’s next to nullptr. Advance prev and curr.',kind:'list',links:[-1,2,-1],prev:0,curr:1,next:2},
  {title:'Reverse the second edge',detail:'Save node 41 before reversing node 27 → node 12. The prefix is now 27 → 12.',kind:'list',links:[-1,0,-1],prev:1,curr:2,next:-1},
  {title:'Reverse the final edge',detail:'Node 41 now points to node 27. curr becomes nullptr; return prev as the new head.',kind:'list',links:[-1,0,1],prev:2,curr:-1,next:-1}
 ],
 ring:[
  {title:'Empty ring',detail:'Capacity 4. head and tail are both zero; count=0 distinguishes empty from full.',kind:'ring',slots:[null,null,null,null],head:0,tail:0,count:0},
  {title:'push(12)',detail:'Write at tail=0; advance tail to 1; count=1.',kind:'ring',slots:[12,null,null,null],head:0,tail:1,count:1},
  {title:'push(18)',detail:'Write at tail=1; advance tail to 2; count=2.',kind:'ring',slots:[12,18,null,null],head:0,tail:2,count:2},
  {title:'pop() → 12',detail:'Read head=0; advance head to 1; count=1. Slot zero remains stale until overwritten.',kind:'ring',slots:[12,18,null,null],head:1,tail:2,count:1},
  {title:'push(7), push(29), push(31)',detail:'tail wraps to 1; count reaches capacity 4; next push must fail.',kind:'ring',slots:[31,18,7,29],head:1,tail:1,count:4},
  {title:'Backpressure',detail:'When count equals capacity, return false. Overwriting unread data would break FIFO.',kind:'ring',slots:[31,18,7,29],head:1,tail:1,count:4}
 ],
 orderbook:[
  {title:'Add the first bid',detail:'Order 1 buys 3 at tick 100; it rests in the book.',kind:'book',bids:[['100',['#1 ×3']]],asks:[],fills:[]},
  {title:'Add another bid',detail:'Order 2 buys 2 at tick 100. Its time priority is behind order 1.',kind:'book',bids:[['100',['#1 ×3','#2 ×2']]],asks:[],fills:[]},
  {title:'Incoming sell crosses',detail:'Order 3 sells 4 at 99. It executes first against order 1 for 3 at resting price 100.',kind:'book',bids:[['100',['#2 ×2']]],asks:[],fills:['#1 ← #3 : 3 @100']},
  {title:'Partial fill, second resting order',detail:'Remaining one unit executes against order 2. Order 2 rests with one unit, preserving FIFO.',kind:'book',bids:[['100',['#2 ×1']]],asks:[],fills:['#1 ← #3 : 3 @100','#2 ← #3 : 1 @100']},
  {title:'Add ask',detail:'Order 4 sells 2 at 105. Best bid=100 and best ask=105; no trade occurs.',kind:'book',bids:[['100',['#2 ×1']]],asks:[['105',['#4 ×2']]],fills:[]},
  {title:'Cancel order 2',detail:'Remove the remaining bid by order ID. Quantity disappears from resting depth without executing.',kind:'book',bids:[],asks:[['105',['#4 ×2']]],fills:[]}
 ]
};
if(typeof module!=='undefined')module.exports={CPP_REFERENCE_TRACES};