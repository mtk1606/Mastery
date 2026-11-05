'use strict';
const assert=require('node:assert/strict');
const scenes=require('../visual-scenes.js');
const engine=require('../visual-engine.js');
const foundations=require('../foundation-data.js');
assert.equal(scenes.validate(),true);
assert.equal(scenes.scenes.length,27);
assert.equal(engine.sceneCount,27);
assert.equal(new Set(scenes.scenes.map(s=>s.id)).size,scenes.scenes.length);
for(const scene of scenes.scenes){
 const chapter=foundations.chapter(scene.id);
 assert(chapter,scene.id+' points to no Foundation lesson');
 assert(['C0','C1','C2','C3','C4'].includes(chapter.module.id),scene.id+' is not in Phase XIV-B/C/D scope');
 assert(scene.frames.length>=3);
 const all=scene.frames.map(frame=>engine.renderShape(scene,frame));
 assert(all.every(svg=>svg.includes('role="img"')&&svg.includes('<title')&&svg.includes('<desc')&&svg.includes('viewBox="0 0 920 ')),scene.id+' must expose an accessible SVG');
 assert(all.every(svg=>!/<script\b/i.test(svg)),scene.id+' must never contain untrusted scripts');
 assert(scene.challenge.question&&scene.challenge.why&&scene.challenge.options.length===3,scene.id+' missing prediction');
 if(scene.kind==='bindings'){
   for(const f of scene.frames){
    const ids=new Set(f.objects.map(o=>o[0]));
    assert(f.names.every(n=>ids.has(n[1])),scene.id+' binds a name to absent object');
    assert(f.objects.every(o=>!o[3]||ids.has(o[3])),scene.id+' contains a missing inner reference');
   }
 }
 if(scene.kind==='flow')assert(scene.frames.every(f=>f.nodes.length===3&&f.active>=0&&f.active<3));
 if(scene.kind==='hash')for(const f of scene.frames){
   const expected={};
   for(const e of f.events.slice(0,f.processed))expected[e]=(expected[e]||0)+1;
   assert.deepEqual(f.counts,expected,scene.id+' contains incorrect dictionary state');
 }
 if(scene.kind==='bfs')for(const f of scene.frames){
   assert.equal(new Set(f.queue).size,f.queue.length,'BFS may not enqueue a node twice');
   for(const u of f.visited)assert(Number.isInteger(f.distance[u]));
   assert(f.queue.every(u=>Number.isInteger(f.distance[u])));
 }
 if(scene.kind==='capacity'){
   let previousUsed=0,previousCopies=0;
   for(const f of scene.frames){
     assert(f.capacity>=f.used);
     assert(f.used===previousUsed+1,'Only one append per capacity scene');
     assert(f.totalCopies>=previousCopies);
     assert(f.totalCopies===previousCopies+f.copied,'Copy accounting must be additive');
     previousUsed=f.used;previousCopies=f.totalCopies;
   }
 }
 if(scene.kind==='window'){
   for(const f of scene.frames)assert.equal(f.total,f.values.slice(f.left,f.left+f.k).reduce((a,b)=>a+b,0));
 }
 if(scene.kind==='binary'){
   const f=scene.frames.at(-1),index=f.values.findIndex(v=>v===f.target);
   assert.equal(f.result,index,'Final binary lower bound disagrees with expected index');
 }
 if(scene.kind==='dp'){
   const ways=(coins,amount)=>{function recur(i,remaining){
      if(remaining===0)return 1;if(i===coins.length)return 0;
      let total=0;for(let k=0;k<=Math.floor(remaining/coins[i]);k++)total+=recur(i+1,remaining-k*coins[i]);return total;
   }return recur(0,amount)};
   for(const f of scene.frames)f.dp.forEach((v,amount)=>assert.equal(v,ways(f.coins,amount),'Wrong DP count after coins '+f.coins));
 }
}
for(let k=1;k<=4;k++){
 const frames=engine.windowFrames(k);
 assert.equal(frames.length,5-k);
 let best=-Infinity;
 for(const f of frames){
  assert.equal(f.k,k);
  assert.deepEqual(f.values,[1,2,3,4]);
  assert.equal(f.total,f.values.slice(f.left,f.left+k).reduce((a,b)=>a+b,0));
  best=Math.max(best,f.total);assert.equal(f.best,best);
 }
}
for(const target of [0,1,2,3,4,5,6]){
 const frames=engine.binaryFrames(target),last=frames.at(-1);
 assert.equal(last.result,[1,2,2,2,5].findIndex(v=>v===target));
 assert.equal(last.lo,last.hi);
 let width=6;for(const f of frames){
  assert(f.lo>=0&&f.hi<=5&&f.lo<=f.hi);
  if(f.mid!==null){assert(f.mid>=f.lo&&f.mid<f.hi);}
  assert(f.hi-f.lo<=width);width=f.hi-f.lo;
 }
}
console.log('PASS: 27 original Foundation visual models with accessible SVGs, verified reference binding, exact window sums, monotone lower-bound searches, hash prefix counts, BFS queue and DP combination counts.');
