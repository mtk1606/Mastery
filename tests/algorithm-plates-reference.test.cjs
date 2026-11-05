'use strict';
const assert=require('node:assert/strict');
const model=require('../figure-algorithm-model.js');
const plates=require('../figure-algorithm-plates.js');
const bank=require('../visual-scenes.js');
const engine=require('../visual-engine.js');
const path=require('node:path'),fs=require('node:fs');
assert(model.validate(),'Algorithm models failed their own validity gates');
const kinds=['window','binary','bfs','dp'];
assert.deepEqual(plates.kinds,kinds);
const refs=['c2-windows','c2-binary','c2-structures','c2-graphs'];
for(let i=0;i<refs.length;i++){
 const scene=bank.lookup(refs[i]);
 assert(scene&&scene.kind===kinds[i],'Wrong C2 scene mapped');
 assert.equal(scene.frames.length,({'window':3,'binary':4,'bfs':5,'dp':4})[scene.kind]);
 const rendered=plates.render(scene,scene.frames,0);
 assert.equal((rendered.match(/data-plate-panel="/g)||[]).length,scene.frames.length);
 assert(rendered.includes('viewBox="0 0 920 '));
 assert(rendered.includes('<figcaption class="mv-plate-caption">'));
 assert(rendered.includes('SYNCHRONIZED PSEUDOCODE'));
 assert.equal((rendered.match(/data-mv-action="jump"/g)||[]).length,scene.frames.length);
 assert.equal((rendered.match(/plate-panel-selected/g)||[]).length,1);
 assert.equal((rendered.match(/role="img"/g)||[]).length,1);
 assert(rendered.includes('<title id="plateTitle">')&&rendered.includes('<desc id="plateDesc">'));
 assert(rendered.includes('WHY THE ALGORITHM WORKS'));
 assert(!/<script\b/i.test(rendered));
 for(let n=0;n<scene.frames.length;n++){
  const svg=engine.renderShape(scene,scene.frames[n]);
  assert(svg.includes('plate-panel-'+''),'RenderShape must use original multi-panel plate');
  assert(svg.includes('selected state '+(n+1))||svg.includes('Selected state '+(n+1)),'Current state not represented');
 }
}
const match=(a,b,fields)=>fields.forEach(k=>assert.deepEqual(a[k],b[k],'Wrong trace field '+k));
for(let k=1;k<=4;k++){
 const expected=model.windowStates([1,2,3,4],k);
 const actual=k===2?bank.lookup('c2-windows').frames:engine.windowFrames(k);
 assert.equal(expected.length,actual.length);
 let previous=-Infinity;
 for(let i=0;i<actual.length;i++){
  match(actual[i],expected[i],['values','k','left','total','best','out','in']);
  assert(actual[i].best>=previous);
  previous=actual[i].best;
 }
 const q=plates.challengeFor(bank.lookup('c2-windows'),k);
 assert.equal(q.options[q.answer],String(expected.at(-1).best));
 assert.equal(new Set(q.options).size,3);
 const html=plates.render(bank.lookup('c2-windows'),actual,actual.length-1);
 assert(html.includes('['+(actual.length-1)+', '+((actual.length-1)+k)+')')||html.includes('['+(actual.length-1)+','+((actual.length-1)+k)+')'));
}
for(const target of [0,1,2,3,4,5,6]){
 const expected=model.lowerBoundStates([1,2,2,2,5],target);
 const actual=target===2?bank.lookup('c2-binary').frames:engine.binaryFrames(target);
 assert.equal(expected.length,actual.length,'Step count for target '+target);
 for(let i=0;i<actual.length;i++)match(actual[i],expected[i],['values','target','lo','hi','mid','result']);
 const final=expected.at(-1);
 assert.equal(final.result,[1,2,2,2,5].findIndex(v=>v===target));
 const q=plates.challengeFor(bank.lookup('c2-binary'),target);
 assert.equal(q.options[q.answer],String(final.result));
 assert.equal(new Set(q.options).size,3);
}
const actualBfs=bank.lookup('c2-structures').frames,expectedBfs=model.bfsStates();
assert.equal(expectedBfs.length,actualBfs.length);
for(let i=0;i<actualBfs.length;i++){
 match(actualBfs[i],expectedBfs[i],['queue','visited','distance','active']);
 assert.deepEqual(actualBfs[i].distance,expectedBfs[i].distance);
 assert.equal(new Set(actualBfs[i].queue).size,actualBfs[i].queue.length);
}
assert.deepEqual(expectedBfs.at(-1).distance,{A:0,B:1,C:1,D:2});
const actualDp=bank.lookup('c2-graphs').frames,expectedDp=model.coinStages([1,2,5],5);
assert.equal(actualDp.length,expectedDp.length);
for(let i=0;i<actualDp.length;i++){
 match(actualDp[i],expectedDp[i],['coins','dp','focus']);
 const transitions=expectedDp[i].transitions;
 for(const x of transitions)assert.equal(x.before+x.addition,x.after,'Incorrect coin recurrence');
 const full=plates.render(bank.lookup('c2-graphs'),actualDp,i);
 assert((full.match(/plate-dependency/g)||[]).length>=1 || i===0,'DP must visibly draw prerequisite arrows');
}
assert.deepEqual(expectedDp.at(-1).dp,[1,1,2,2,3,4]);
assert(plates.programs.binary.some(x=>x.includes('lo = mid + 1')),'Wrong binary search code');
assert(!plates.programs.binary.some(x=>x.includes('else: hi = mid + 1')),'Invalid binary half search');
const foundation=fs.readFileSync(path.join(__dirname,'../foundation.html'),'utf8');
assert(foundation.includes('figure-algorithm-model.js'));
assert(foundation.includes('figure-algorithm-plates.js'));
assert(foundation.includes('figure-algorithm-plates.css'));
console.log('PASS: original four full-sequence algorithm plates, exact sliding-window/low-bound variants, FIFO graph states, unordered coin DP dependencies, synchronized pseudocode and SVG figure structure.');
