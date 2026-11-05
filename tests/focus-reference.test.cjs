'use strict';
const assert=require('node:assert/strict'),core=require('../focus-core.js');
let checks=0;
for(let run=1;run<=130;run++){
 const tasks=core.plan(run);
 assert.equal(tasks.length,3);assert.equal(new Set(tasks.map(x=>x.id)).size,3);
 for(const task of tasks){
   assert(Number.isFinite(task.answer),task.id);
   assert.equal(task.why.length,3);
   assert(task.correct>=0&&task.correct<=2);
   assert(core.grade(String(task.answer),task.answer).ok,task.id);
   assert(!core.grade(String(task.answer+2),task.answer).ok,task.id);
   checks++;
 }
}
const p=core.plan(11,[{id:'maker',correct:false} ],['bayes','maker']);
assert.equal(p[0].id,'bayes');assert.equal(p[1].id,'maker');
const recovered=core.plan(11,[{id:'maker',correct:false},{id:'maker',correct:true}],['bayes']);
assert.equal(recovered[0].id,'bayes');
for(const x of ['','foo','0x10','1e2','NaN','Infinity','7%'])assert.equal(core.grade(x,1).valid,false,x);
assert.equal(core.grade('1.00',1).ok,true);
assert.equal(core.grade('1.5',1).ok,false);
console.log('PASS Focus reference: '+checks+' generated tasks, numerical checks, 3 distinct topics, spaced-review priority and invalid input');