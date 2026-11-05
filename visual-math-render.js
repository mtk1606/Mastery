/* Phase XIV-C — original SVG renderers of exact, independently checkable mathematical models.
 * Receives the existing SVG primitive helpers; does not use external libraries. */
(function(root){
'use strict';
const round=(x,d=3)=>Number(x).toFixed(d).replace(/\.?0+$/,'');
function drawInduction(f,{R,T,L,C,P}){
 const {n,previous,ring,total,focus}=f;
 const size=44,left=68,top=54;
 let out=T(53,32,'THE GEOMETRY OF 1 + 3 + ... + (2n − 1) = n²','mv-kicker');
 for(let row=0;row<n;row++)for(let col=0;col<n;col++){
  const newest=row===n-1||col===n-1,visible=focus!=='previous'||!newest;
  if(!visible)continue;
  const x=left+col*size,y=top+row*size;
  out+=R(x,y,size-3,size-3,newest?'mv-math-highlight':'mv-math-base',5);
  out+=T(x+(size-3)/2,y+26,'•','mv-math-dot','middle');
 }
 out+=R(425,62,438,76,'mv-value-panel')+T(448,91,'INDUCTION HYPOTHESIS','mv-kicker')+T(448,119,`(n−1)² = ${previous}`,'mv-math-value');
 out+=R(425,148,438,76,focus==='border'?'mv-selected':'mv-value-panel')+T(448,177,'NEW BORDER (n + n − 1)','mv-kicker')+T(448,205,`2n−1 = ${ring}`,'mv-math-value');
 out+=R(425,235,438,76,focus==='complete'?'mv-selected':'mv-value-panel')+T(448,264,'COMPLETED SQUARE','mv-kicker')+T(448,290,`${previous} + ${ring} = ${total} = ${n}²`,'mv-math-value');
 out+=T(69,329,'Neutral = previous square     Brass = the new odd-number border','mv-note');
 return out;
}
function drawBayes(f,{R,T,L,C,P}){
 /* Original pedagogical plate: 1 glyph = 1 person. Grid populations retain exact TP/FN/FP/TN counts. */
 const {focus,affected,unaffected,tp,fn,fp,tn,total,priorPct,positive,posterior}=f;
 const phase={
  prior:['BASE RATE',affected+' / '+total,priorPct.toFixed(2)+'%','of the population is affected.'],
  truePositive:['SENSITIVITY',tp+' / '+affected,(100*tp/affected).toFixed(0)+'%','of affected people test positive.'],
  falsePositive:['FALSE-POSITIVE RATE',fp+' / '+unaffected,(100*fp/unaffected).toFixed(0)+'%','of unaffected people test positive.'],
  positiveGroup:['ALL POSITIVE RESULTS',tp+' + '+fp+' = '+positive,(100*positive/total).toFixed(2)+'%','of the population tests positive.'],
  posterior:['POSTERIOR PROBABILITY',tp+' / '+positive,(posterior*100).toFixed(2)+'%','of positive tests are truly affected.']
 }[focus];
 const c=(x,y,text,cls,anchor='start')=>T(x,y,text,'mv-plate-'+cls,anchor);
 let out=R(0,0,920,350,'mv-plate-paper',0);
 out+=c(40,30,'FIGURE · CONDITIONAL PROBABILITY','section');
 out+=c(880,30,'EACH SMALL SQUARE = ONE PERSON','small','end');
 out+=L(40,43,880,43,'mv-plate-rule');
 out+=c(40,64,'A population of 1,000, grouped by actual condition and test outcome','subtitle');
 // Grouped outcomes form a color-coded frequency diagram, not a spatial map.
 const columns=50,rows=20,size=7.1,pitchX=10.35,pitchY=10.25,startX=45,startY=78;
 const classes=['mv-bayes-tp','mv-bayes-fn','mv-bayes-fp','mv-bayes-tn'],counts=[tp,fn,fp,tn];
 out+='<g class="mv-bayes-population" aria-label="Exactly one thousand person squares">';
 let idx=0;
 for(let group=0;group<4;group++){
  for(let i=0;i<counts[group];i++,idx++){
   const x=startX+(idx%columns)*pitchX,y=startY+Math.floor(idx/columns)*pitchY;
   let color=classes[group];
   if(focus==='prior')color=group<2?'mv-bayes-prior':'mv-bayes-neutral';
   else if(focus==='truePositive'&&group>=2)color='mv-bayes-neutral';
   else if(focus==='falsePositive'&&group===3)color='mv-bayes-neutral';
   else if((focus==='positiveGroup'||focus==='posterior')&&(group===1||group===3))color='mv-bayes-faded';
   out+=R(Number(x.toFixed(2)),Number(y.toFixed(2)),size,size,color,0.7);
  }
 }
 out+='</g>';
 out+=L(597,75,597,308,'mv-plate-rule');
 out+=c(625,88,phase[0],'section');
 out+=c(625,144,phase[1],focus==='positiveGroup'?'fraction-compact':'fraction');
 out+=c(625,204,phase[2],'percentage');
 out+=c(625,234,phase[3],'detail');
 if(focus==='posterior')out+=c(625,265,'False positives enter the denominator.','insight');
 else if(focus==='positiveGroup')out+=c(625,265,'Next: condition on these '+positive+' positives.','insight');
 else if(focus==='prior')out+=c(625,265,'Only '+affected+' of '+total+' people are affected.','insight');
 else out+=c(625,265,'The denominator is crucial.','insight');
 const legend=focus==='prior'?
  [['mv-bayes-prior','Affected',affected],['mv-bayes-neutral','Unaffected',unaffected]]:
  [['mv-bayes-tp','True +',tp],[(focus==='posterior'||focus==='positiveGroup')?'mv-bayes-faded':'mv-bayes-fn','False −',fn],
   ['mv-bayes-fp','False +',fp],[(focus==='posterior'||focus==='positiveGroup')?'mv-bayes-faded':'mv-bayes-tn','True −',tn]];
 legend.forEach((item,i)=>{
  const x=44+(i%2)*270,y=297+Math.floor(i/2)*22;
  out+=R(x,y-10,10,10,item[0],1);
  out+=c(x+17,y,item[1]+' · '+item[2]+' people','legend');
 });
 out+=c(879,322,'Counts: '+tp+' + '+fn+' + '+fp+' + '+tn+' = '+total,'small','end');
 out+=L(40,337,880,337,'mv-plate-rule');
 out+=c(42,347,'Population model · 90% sensitivity · 10% false-positive rate · grouped by outcome, not geography.','footnote');
 return out;
}
function drawIndicators(f,{R,T,L,C,P}){
 const {red,blue,pairs,cases,probabilities,expected,focus}=f;
 let out=T(52,35,'TWO DRAWS WITHOUT REPLACEMENT · FIVE DISTINGUISHABLE BALLS','mv-kicker');
 const top=112;
 for(let i=0;i<5;i++){
  const x=72+i*71;
  out+=C(x,top,24,i<red?'mv-urn-red':'mv-urn-blue')+T(x,top+43,'#'+(i+1),'mv-kicker','middle');
 }
 out+=T(52,63,red+' red + '+blue+' blue; sample two distinct balls','mv-strong');
 const barMax=Math.max(...probabilities,.1),w=115;
 probabilities.forEach((p,i)=>{
  const x=471+i*139,barH=p/barMax*125,y=236-barH;
  out+=R(x,y,w,barH,focus==='distribution'||focus==='expectation'?'mv-math-highlight':'mv-object',6);
  out+=T(x+w/2,253,'X = '+i,'mv-kicker','middle');
  out+=T(x+w/2,y-11,(p*100).toFixed(0)+'%','mv-strong','middle');
  out+=T(x+w/2,276,cases[i]+' / '+pairs,'mv-kicker','middle');
 });
 out+=L(466,236,891,236,'mv-edge');
 out+=R(50,286,369,47,focus==='expectation'?'mv-selected':'mv-value-panel');
 out+=T(68,316,'E[X] = 2 × '+red+'/5 = '+expected.toFixed(2),'mv-math-value');
 out+=T(469,319,'Linearity does not require independent draws.','mv-note');
 return out;
}
function drawSampling(f,{R,T,L,C,P}){
 const {n,p,pmf,se,focus}=f;
 let out=T(51,32,'EXACT BINOMIAL MASS · SAMPLE MEAN = K / n','mv-kicker');
 const left=78,right=860,top=67,bottom=261,width=right-left,height=bottom-top;
 const max=Math.max(...pmf),maxY=max*1.1;
 out+=L(left,bottom,right,bottom,'mv-edge')+L(left,top,left,bottom,'mv-edge');
 const valueAt=k=>({x:left+(k/n)*width,y:bottom-pmf[k]/maxY*height});
 // Plot exact probability *masses* at their discrete support points, connected only as a reading aid.
 let line='';
 pmf.forEach((prob,k)=>{const c=valueAt(k);line+=(k?' L ':'M ')+c.x.toFixed(2)+' '+c.y.toFixed(2);});
 out+=P(line,'mv-math-curve');
 const mark=left+p*width;
 const lo=Math.max(left,left+(p-se)*width),hi=Math.min(right,left+(p+se)*width);
 if(['spread','limits'].includes(focus)){
  out+=R(lo,top,Math.max(0,hi-lo),height,'mv-math-band',0);
  out+=L(lo,top,lo,bottom,'mv-math-guide')+L(hi,top,hi,bottom,'mv-math-guide');
 }
 out+=L(mark,top,mark,bottom,'mv-math-mean');
 if(n<=100)pmf.forEach((prob,k)=>{const {x,y}=valueAt(k);out+=C(x,y,n===25?3.8:2.1,'mv-math-point');});
 out+=T(left,286,'0','mv-kicker','middle')+T(right,286,'1','mv-kicker','middle');
 out+=T((left+right)/2,309,'Possible sample-mean value K / n','mv-kicker','middle');
 out+=T(81,53,'P(K = k) · tick maximum '+max.toFixed(3),'mv-kicker');
 out+=R(557,12,305,39,'mv-value-panel',5)+T(572,36,`n=${n}   p=${p}   SE=${se.toFixed(4)}`,'mv-strong');
 out+=T(mark,71,'mean','mv-focus-text','middle');
 return out;
}
function vectorPath(v,center=[418,184],scale=37){
 return [center[0]+v[0]*scale,center[1]-v[1]*scale];
}
function drawMatrix(f,{R,T,L,C,P}){
 const {A,v,e1,e2,out,focus,transform}=f;
 let svg=T(51,34,'LINEAR MAP · 2×2 MATRIX TRANSFORM','mv-kicker');
 const ox=350,oy=181,scale=35;
 for(let z=-5;z<=5;z++){
  svg+=L(ox+z*scale,oy-5*scale,ox+z*scale,oy+5*scale,'mv-math-grid');
  svg+=L(ox-5*scale,oy+z*scale,ox+5*scale,oy+z*scale,'mv-math-grid');
 }
 svg+=L(ox-5*scale,oy,ox+5*scale,oy,'mv-edge')+L(ox,oy-5*scale,ox,oy+5*scale,'mv-edge');
 svg+=T(ox+5*scale+4,oy-8,'x','mv-kicker')+T(ox+7,oy-5*scale+12,'y','mv-kicker');
 const point=w=>[ox+w[0]*scale,oy-w[1]*scale];
 const arrow=(w,cls,label)=>{
  const [x,y]=point(w);svg+=P(`M ${ox} ${oy} L ${x} ${y}`,cls);
  svg+=T(x+9,y-10,label,'mv-math-vector-text');
 };
 if(['basis','multiply','compare'].includes(focus)){
  const a=point(e1),b=point([e1[0]+e2[0],e1[1]+e2[1]]),c=point(e2);
  svg+=P(`M ${ox} ${oy} L ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} Z`,'mv-math-parallelogram');
  arrow(e1,'mv-math-basis-a','A·e1');arrow(e2,'mv-math-basis-b','A·e2');
 }
 arrow(v,'mv-math-input','v');
 if(['multiply','compare'].includes(focus))arrow(out,'mv-math-output','Av');
 svg+=R(605,59,280,74,'mv-value-panel')+T(622,81,'MATRIX A · '+transform.toUpperCase(),'mv-kicker');
 svg+=T(620,115,`[ ${A[0].join('   ')} ]   [ ${A[1].join('   ')} ]`,'mv-strong');
 svg+=R(605,146,280,63,'mv-value-panel')+T(622,170,'INPUT v','mv-kicker')+T(622,194,'('+v.join(', ')+')','mv-math-value');
 svg+=R(605,218,280,63,focus==='compare'?'mv-selected':'mv-value-panel')+T(622,242,'OUTPUT Av','mv-kicker')+T(622,267,'('+out.join(', ')+')','mv-math-value');
 svg+=T(608,314,'Blue: input  ·  Brass: transformed output','mv-note');
 return svg;
}
function drawGradient(f,{R,T,L,C,P}){
 const {w0,w1,oldLoss,newLoss,lr,g0,focus}=f;
 let svg=T(52,32,'L(w) = (2w − 4)²    ·    L′(w) = 4(2w − 4)','mv-kicker');
 const domainLo=-1,domainHi=Math.max(5,w1+1),left=83,right=827,top=68,bottom=269;
 const Lw=w=>(2*w-4)**2;
 const maxL=Math.max(Lw(domainLo),Lw(domainHi),oldLoss,newLoss)*1.03;
 const cx=w=>left+(w-domainLo)/(domainHi-domainLo)*(right-left),cy=val=>bottom-val/maxL*(bottom-top);
 svg+=L(left,top,left,bottom,'mv-edge')+L(left,bottom,right,bottom,'mv-edge');
 let path='';const samples=150;for(let i=0;i<=samples;i++){
  const w=domainLo+(domainHi-domainLo)*i/samples;path+=(i?' L ':'M ')+cx(w).toFixed(2)+' '+cy(Lw(w)).toFixed(2);
 }
 svg+=P(path,'mv-math-curve');
 const xOld=cx(w0),yOld=cy(oldLoss),xNew=cx(w1),yNew=cy(newLoss);
 svg+=L(cx(2),top,cx(2),bottom,'mv-math-guide')+T(cx(2),289,'optimum w=2','mv-kicker','middle');
 svg+=C(xOld,yOld,7,'mv-math-start')+T(xOld+14,yOld-14,'w0=1','mv-math-vector-text');
 if(['step','compare'].includes(focus)){
  svg+=P(`M ${xOld} ${yOld} L ${xNew} ${yNew}`,'mv-math-update');
  svg+=C(xNew,yNew,8,'mv-math-finish')+T(Math.min(right-50,xNew+12),Math.max(top+10,yNew-12),'w1='+round(w1,3),'mv-math-vector-text');
 }
 svg+=T(left,55,'Loss: 0 to '+round(maxL,2),'mv-kicker')+T(right,289,'w','mv-kicker','middle');
 svg+=R(57,303,820,37,'mv-value-panel',5);
 svg+=T(71,327,`η = ${lr}   ·   gradient = ${g0}   ·   w_new = ${round(w1,3)}   ·   L_new = ${round(newLoss,4)}`,'mv-strong');
 return svg;
}
const maps={induction:drawInduction,bayes:drawBayes,indicators:drawIndicators,sampling:drawSampling,matrix:drawMatrix,gradient:drawGradient};
function render(scene,frame,helpers){
 const fn=maps[scene.kind];if(!fn)throw Error('Unknown math visual '+scene.kind);
 return fn(frame,helpers);
}
const api={render,kinds:Object.keys(maps)};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryMathRender=api;
})(typeof window!=='undefined'?window:globalThis);
