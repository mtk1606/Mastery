'use strict';
const assert=require('node:assert/strict');
const math=require('../visual-math.js');
const foundation=require('../foundation-data.js');
const scenes=require('../visual-scenes.js');
const engine=require('../visual-engine.js');
assert(math.validate());
assert.equal(math.scenes.length,6);
assert.equal(scenes.scenes.length,21);
assert.equal(engine.sceneCount,21);
for(const s of math.scenes){
 assert.equal(foundation.chapter(s.id).module.id,'C3',s.id+' must map to the C3 chapter');
 assert.equal(s.frames.length,math.framesFor(s,undefined).length);
 for(const f of s.frames){
  const svg=engine.renderShape(s,f);
  assert.match(svg,/<svg\b/);
  assert.match(svg,/<title id=/);
  assert.match(svg,/<desc id=/);
  assert.match(svg,/role="img"/);
  assert(!/<script\b/i.test(svg));
 }
}
for(const n of math.choices.induction){
 const frames=math.inductionFrames(n),last=frames.at(-1);
 assert.equal(last.previous,(n-1)**2);
 assert.equal(last.ring,2*n-1);
 assert.equal(last.total,n*n);
 assert.equal(last.previous+last.ring,last.total);
}
for(const prior of math.choices.bayes){
 const frames=math.bayesFrames(prior),f=frames.at(-1),q=math.challengeFor(math.scenes[1],prior);
 assert.equal(f.total,1000);
 assert.equal(f.affected,prior*10);
 assert.equal(f.tp+f.fn,f.affected);
 assert.equal(f.fp+f.tn,f.unaffected);
 assert.equal(f.tp+f.fp,f.positive);
 assert(Math.abs(f.posterior-f.tp/f.positive)<1e-12);
 assert(q.question.includes(f.tp+' true positives')&&q.question.includes(f.fp+' false positives'));
 assert(q.options[q.answer].includes((100*f.posterior).toFixed(2)+'%'));
}
const choose=(n,k)=>{
 let v=1;for(let i=0;i<k;i++)v=v*(n-i)/(i+1);return v;
};
for(const red of math.choices.indicators){
 const f=math.indicatorFrames(red).at(-1);
 assert.deepEqual(f.cases,[choose(5-red,2),red*(5-red),choose(red,2)]);
 assert.equal(f.cases.reduce((a,b)=>a+b,0),10);
 assert(Math.abs(f.probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
 assert(Math.abs(f.expected-2*red/5)<1e-12);
 const q=math.challengeFor(math.scenes[2],red);
 assert(q.options[q.answer]===f.expected.toFixed(2));
}
for(const n of math.choices.samplingN)for(const p of math.choices.samplingP){
 const f=math.samplingFrames({n,p}).at(-1),pr=f.pmf;
 assert.equal(pr.length,n+1);
 assert(Math.abs(pr.reduce((a,b)=>a+b,0)-1)<1e-12);
 assert(pr.every(x=>x>=0&&Number.isFinite(x)));
 const mean=pr.reduce((sum,v,k)=>sum+v*(k/n),0);
 const variance=pr.reduce((sum,v,k)=>sum+v*(k/n-mean)**2,0);
 assert(Math.abs(mean-p)<1e-11,'Wrong exact binomial mean: n='+n+' p='+p);
 assert(Math.abs(variance-p*(1-p)/n)<1e-11,'Wrong exact binomial variance');
 assert(Math.abs(f.se**2-f.varMean)<1e-12);
}
for(const transform of math.choices.matrix)for(const vector of math.choices.matrixVector){
 const f=math.matrixFrames({transform,vector}).at(-1);
 const expected=[0,1].map(i=>f.A[i][0]*f.v[0]+f.A[i][1]*f.v[1]);
 assert.deepEqual(f.out,expected);
 assert.deepEqual(f.e1,[f.A[0][0],f.A[1][0]]);
 assert.deepEqual(f.e2,[f.A[0][1],f.A[1][1]]);
}
const quadratic=w=>(2*w-4)**2;
for(const lr of math.choices.gradient){
 const f=math.gradientFrames(lr).at(-1);
 assert.equal(f.w0,1);
 assert.equal(f.g0,-8);
 assert(Math.abs(f.w1-(f.w0-lr*f.g0))<1e-12);
 assert(Math.abs(f.newLoss-quadratic(f.w1))<1e-10);
 assert(Math.abs(f.oldLoss-quadratic(f.w0))<1e-10);
}
assert(math.gradientFrames(.1).at(-1).newLoss<4,'Small step must reduce loss');
assert(math.gradientFrames(1).at(-1).newLoss>4,'Large step must overshoot');
assert(math.gradientFrames(.125).at(-1).newLoss===0,'Optimal learning rate on this quadratic should land at w=2');
console.log('PASS: all six C3 mathematical renderers, induction identities, Bayes population partitions, dependent urn expectations, 15 exact binomial PMFs, 12 linear transforms, and six gradient steps/overshoots.');
