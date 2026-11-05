/* Phase XIV-C: independent numerical models, not hand-drawn approximations.
 * Every frame is computed from an explicit mathematical example and independently testable. */
(function(root){
'use strict';
const F=(label,explain,model)=>({label,explain,...model});
const choices={
 induction:[2,3,4,5,6],
 bayes:[1,5,10,25],
 indicators:[1,2,3,4],
 samplingN:[25,100,400],
 samplingP:[0.1,0.25,0.5,0.75,0.9],
 matrix:['identity','stretch','shear','rotate'],
 matrixVector:['2,1','1,2','-1,1'],
 gradient:[0.05,0.1,0.125,0.25,0.5,1]
};
function inductionFrames(n=4){
 if(!choices.induction.includes(n))throw Error('Unrecognized induction parameter');
 const previous=(n-1)**2,ring=2*n-1,total=n*n;
 return [
 F('The induction assumption: a smaller square','The first '+(n-1)+' odd numbers sum to '+previous+', exactly the area of a '+(n-1)+'×'+(n-1)+' square. That is the hypothesis for this step.',{n,focus:'previous',previous,ring,total}),
 F('The next odd number forms the new border','To grow a square from side '+(n-1)+' to side '+n+', add '+n+' cells on the bottom and '+(n-1)+' on the right. That is '+ring+' = 2n−1 new cells.',{n,focus:'border',previous,ring,total}),
 F('The enlarged square proves the step','The previous '+previous+' cells plus the '+ring+' new ones give '+total+' cells, which equals '+n+'². Combined with base n=1, this supports induction for every positive integer.',{n,focus:'complete',previous,ring,total})
 ];
}
function bayesFrames(priorPct=1){
 if(!choices.bayes.includes(priorPct))throw Error('Unrecognized Bayes prior');
 const total=1000,affected=10*priorPct,unaffected=total-affected,sensitivity=.9,fpr=.1;
 const tp=affected*9/10,fn=affected-tp,fp=unaffected/10,tn=unaffected-fp,positive=tp+fp,posterior=tp/positive;
 const base={total,priorPct,affected,unaffected,tp,fn,fp,tn,positive,posterior,sensitivity,fpr};
 return [
 F('Begin with the actual base rate','Out of '+total+' people, '+affected+' have the condition ('+priorPct+'%). The remaining '+unaffected+' do not. The prior is a population proportion, not a test result.',{...base,focus:'prior'}),
 F('Apply sensitivity to affected people','At 90% sensitivity, '+tp+' of '+affected+' affected people test positive and '+fn+' test negative. This is P(positive | affected), not the posterior.',{...base,focus:'truePositive'}),
 F('Apply false-positive rate to unaffected people','At a 10% false-positive rate, '+fp+' of '+unaffected+' unaffected people also test positive. They enter the denominator of the posterior calculation.',{...base,focus:'falsePositive'}),
 F('Condition on everyone who tested positive','There are '+positive+' positive results in total: '+tp+' true positives plus '+fp+' false positives. The comparison group is now positives only.',{...base,focus:'positiveGroup'}),
 F('Calculate the posterior from the conditioned group','Of the '+positive+' positive results, '+tp+' are genuinely affected. P(affected | positive) = '+tp+'/'+positive+' ≈ '+(posterior*100).toFixed(2)+'%. The prior matters.',{...base,focus:'posterior'})
 ];
}
const comb=(n,k)=>k<0||k>n?0:k===0?1:Array.from({length:k},(_,i)=>(n-i)/(i+1)).reduce((a,b)=>a*b,1);
function indicatorFrames(red=3){
 if(!choices.indicators.includes(red))throw Error('Unrecognized urn composition');
 const blue=5-red,pairs=comb(5,2);
 const cases=[comb(blue,2),red*blue,comb(red,2)],probabilities=cases.map(c=>c/pairs);
 const expected=probabilities[1]+2*probabilities[2];
 const base={red,blue,pairs,cases,probabilities,expected};
 return [
 F('Two draws without replacement create dependence','This urn holds '+red+' red and '+blue+' blue balls. Draw two without replacement; the color of the first draw changes the second conditional probability.',{...base,focus:'urn'}),
 F('Enumerate all equally likely unordered pairs','There are C(5,2)=10 equally likely pairs of distinct physical balls. Counts for zero, one and two reds are '+cases.join(', ')+' respectively.',{...base,focus:'cases'}),
 F('Convert event counts into the distribution','P(X=0), P(X=1), P(X=2) are '+probabilities.map(p=>p.toFixed(2)).join(', ')+'. These three probabilities sum to one.',{...base,focus:'distribution'}),
 F('Indicators make expected counts simpler','Let I1 and I2 indicate a red draw. Each has mean '+red+'/5, even without independence. E[I1+I2] = 2×'+red+'/5 = '+expected.toFixed(2)+'.',{...base,focus:'expectation'})
 ];
}
function binomialPMF(n,p){
 if(!Number.isInteger(n)||n<1||!Number.isFinite(p)||p<=0||p>=1)throw Error('Bad binomial parameters');
 const logs=[0];for(let i=1;i<=n;i++)logs.push(logs[i-1]+Math.log(i));
 const lp=[],lq=Math.log1p(-p),lpp=Math.log(p);
 for(let k=0;k<=n;k++)lp.push(logs[n]-logs[k]-logs[n-k]+k*lpp+(n-k)*lq);
 const peak=Math.max(...lp),w=lp.map(x=>Math.exp(x-peak)),sum=w.reduce((a,b)=>a+b,0);
 return w.map(x=>x/sum);
}
function samplingFrames(param={n:100,p:.5}){
 const n=param?.n??100,p=param?.p??.5;
 if(!choices.samplingN.includes(n)||!choices.samplingP.includes(p))throw Error('Unsupported sampling control');
 const pmf=binomialPMF(n,p),mean=p,varMean=p*(1-p)/n,se=Math.sqrt(varMean);
 const base={n,p,pmf,mean,varMean,se};
 return [
 F('A single observation is either 0 or 1','For Bernoulli('+p+'), the value 1 has probability '+p+' and value 0 has probability '+(1-p).toFixed(2)+'. The individual variance is p(1−p) = '+(p*(1-p)).toFixed(4)+'.',{...base,focus:'single'}),
 F('Average n independent observations','With n = '+n+' IID trials, X̄ = K/'+n+' where K follows Binomial('+n+', '+p+'). This diagram uses the exact binomial probabilities, not a normal approximation.',{...base,focus:'distribution'}),
 F('Mark the mean and standard error','The distribution is centered at p = '+p+'. Under IID sampling, SD(X̄) = sqrt[p(1−p)/n] = '+se.toFixed(4)+'. The width decreases as sample size grows.',{...base,focus:'spread'}),
 F('Do not silently assume observations are IID','The exact binomial curve and standard-error formula require independent Bernoulli trials with constant p. Correlation or drift can invalidate this model.',{...base,focus:'limits'})
 ];
}
const matrices={
 identity:[[1,0],[0,1]],stretch:[[2,0],[0,1]],shear:[[1,1],[0,1]],rotate:[[0,-1],[1,0]]
};
function matrixFrames(param={transform:'shear',vector:'2,1'}){
 const transform=param?.transform??'shear',vstr=param?.vector??'2,1';
 if(!choices.matrix.includes(transform)||!choices.matrixVector.includes(vstr))throw Error('Unsupported matrix control');
 const A=matrices[transform],v=vstr.split(',').map(Number);
 const mul=w=>[A[0][0]*w[0]+A[0][1]*w[1],A[1][0]*w[0]+A[1][1]*w[1]];
 const e1=mul([1,0]),e2=mul([0,1]),out=mul(v);
 const base={A,v,e1,e2,out,transform};
 return [
 F('Begin with an input vector and a 2×2 matrix','The input vector is ('+v.join(', ')+'). A linear transformation is determined by what it does to the unit basis vectors e1 and e2.',{...base,focus:'input'}),
 F('The columns show transformed basis vectors','A·e1 is ('+e1.join(', ')+'); A·e2 is ('+e2.join(', ')+'). These are the columns of A in standard coordinates.',{...base,focus:'basis'}),
 F('Combine coordinates through the matrix','Use the basis decomposition: for v=('+v.join(',')+'), Av = '+v[0]+'·('+e1.join(',')+') + '+v[1]+'·('+e2.join(',')+') = ('+out.join(', ')+'). This explicitly multiplies each vector component by its transformed basis.',{...base,focus:'multiply'}),
 F('Compare the input and output arrows','The starting vector ('+v.join(', ')+') becomes ('+out.join(', ')+'). Changing A modifies the linear map, not the meaning of the vector coordinates.',{...base,focus:'compare'})
 ];
}
function gradientFrames(lr=.1){
 if(!choices.gradient.includes(lr))throw Error('Unsupported learning rate');
 const x=2,y=4,w0=1,loss=w=>(w*x-y)**2,g0=2*(w0*x-y)*x,w1=w0-lr*g0;
 const oldLoss=loss(w0),newLoss=loss(w1);
 const base={x,y,w0,w1,lr,g0,oldLoss,newLoss,optimum:2};
 return [
 F('Start with a quadratic loss','Let L(w)=(2w−4)². At w = 1, prediction is 2, residual −2 and loss is '+oldLoss+'. The minimum occurs at w = 2.',{...base,focus:'start'}),
 F('Calculate the local derivative','By the chain rule, L′(w)=2(2w−4)·2. At w = 1 the gradient is −8, pointing to increasing loss as w decreases.',{...base,focus:'gradient'}),
 F('Take a step opposite the gradient','Update w = 1 − η×(−8). For η = '+lr+', the next weight is '+w1.toFixed(3)+'; the new loss is '+newLoss.toFixed(4)+'.',{...base,focus:'step'}),
 F('Check whether the loss actually decreased',newLoss<oldLoss-1e-10?
   'Here '+newLoss.toFixed(4)+' is less than the starting loss '+oldLoss+'. This specific step descends, but other learning rates can overshoot.':
   newLoss>oldLoss+1e-10?
   'Here '+newLoss.toFixed(4)+' exceeds the starting loss '+oldLoss+'. A step opposite the local gradient can increase loss when η is too large.':
   'Here the loss is '+newLoss.toFixed(4)+', equal to the starting loss '+oldLoss+'. A nonzero gradient alone does not guarantee improvement with an arbitrary step size.',
   {...base,focus:'compare'})
 ];
}
const scene=(id,kind,title,purpose,frames,challenge,source)=>({id,kind,title,purpose,frames,challenge,source});
const scenes=[
 scene('c3-proofs','induction','Make induction visible as a growing square','Show why the next odd integer supplies exactly the outer border of the next square.',inductionFrames(4),
 {question:'What is the difference n²−(n−1)²?',options:['n','2n−1','2n+1'],answer:1,why:'The new right column and bottom row add n+(n−1)=2n−1 distinct cells.'},'Proof by induction and visual algebra; original model'),
 scene('c3-counting','bayes','Bayes from a real population of 1,000','See how base rates, sensitivity and false positives determine what a positive test means.',bayesFrames(1),
 {question:'With 9 true positives and 99 false positives, what is P(affected | positive)?',options:['90%','9/108 ≈ 8.33%','1%'],answer:1,why:'Condition on everyone testing positive: 9 of 108 people have the condition, not 90%.'},'Harvard Stat 110; original frequency-table model'),
 scene('c3-expect','indicators','Indicators turn dependent draws into a simple expected count','Enumerate the count distribution and see why expected values add without independence.',indicatorFrames(3),
 {question:'Draw two balls without replacement from three red and two blue. Expected red count?',options:['1.2','0.6','2'],answer:0,why:'Each draw is red with marginal probability 3/5. Linearity gives 3/5+3/5=1.2.'},'Blitzstein–Hwang probability; original urn model'),
 scene('c3-variance','sampling','See the exact sampling distribution shrink','Change p and n to compare the exact Binomial distribution of the sample mean and its theoretical standard error.',samplingFrames(),
 {question:'For IID Bernoulli samples, quadrupling n changes the mean standard error by…',options:['×4','×2','×½'],answer:2,why:'SD(sample mean)=sqrt[p(1−p)/n]. Multiplying n by four divides standard error by two.'},'Harvard Stat 110; exact binomial mass, not normal approximations'),
 scene('c3-linear','matrix','A matrix moves basis vectors—and therefore every vector','Explore identity, stretch, shear and quarter-turn maps with original input and output vectors.',matrixFrames(),
 {question:'What do the columns of a 2×2 matrix represent geometrically?',options:['Only the vector lengths','The images of the unit basis vectors','The coordinates of its eigenvalues'],answer:1,why:'Multiplying A by e1 and e2 returns the first and second columns, specifying the map on any vector.'},'MIT linear algebra; original vector-transform model'),
 scene('c3-opt','gradient','Watch a gradient step descend—or overshoot','Plot the actual quadratic loss, derivative and next weight for adjustable learning rates.',gradientFrames(),
 {question:'Does subtracting the gradient always lower the loss for any η>0?',options:['Yes, for every η','No, excessive η can overshoot','Only if the gradient is zero'],answer:1,why:'The gradient is local; a large step can cross the minimum and reach a higher-loss position.'},'Optimization by derivatives; original quadratic model')
];
function validate(){
 const ids=new Set();for(const s of scenes){
  if(ids.has(s.id)||s.frames.length<3||s.challenge.options.length!==3||!s.source)throw Error('Invalid math model '+s.id);
  ids.add(s.id);
  for(const f of s.frames)if(!f.label||f.explain.length<55)throw Error('Unclear math frame '+s.id);
 }
 return scenes.length===6;
}
function framesFor(scene,param){
 switch(scene.kind){
 case 'induction':return inductionFrames(param??4);
 case 'bayes':return bayesFrames(param??1);
 case 'indicators':return indicatorFrames(param??3);
 case 'sampling':return samplingFrames(param??{n:100,p:.5});
 case 'matrix':return matrixFrames(param??{transform:'shear',vector:'2,1'});
 case 'gradient':return gradientFrames(param??.1);
 default:return null;
 }
}
function challengeFor(scene,param){
 if(scene.id==='c3-counting'){
  const f=bayesFrames(param??1).at(-1),percent=(100*f.posterior).toFixed(2);
  return {question:'At a '+f.priorPct+'% base rate, '+f.tp+' true positives and '+f.fp+' false positives arise per 1,000. What is P(affected | positive)?',
    options:[(f.sensitivity*100)+'% (test sensitivity)',percent+'% (posterior)',f.priorPct+'% (prior probability)'],answer:1,
    why:'Condition on '+f.positive+' positive results: '+f.tp+' affected among all positive tests, hence '+f.tp+'/'+f.positive+' = '+percent+'%.'};
 }
 if(scene.id==='c3-expect'){
  const f=indicatorFrames(param??3).at(-1);
  return {question:'Draw two from '+f.red+' red and '+f.blue+' blue without replacement. What is the expected number of red draws?',
    options:[f.expected.toFixed(2),(f.red/5).toFixed(2),'2.00'],answer:0,
    why:'Each draw has red marginal probability '+f.red+'/5; linearity gives E[X] = 2×'+f.red+'/5 = '+f.expected.toFixed(2)+' despite dependence.'};
 }
 return scene.challenge;
}
const api={scenes,choices,matrices,inductionFrames,bayesFrames,indicatorFrames,binomialPMF,samplingFrames,matrixFrames,gradientFrames,framesFor,challengeFor,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryMathVisuals=api;
})(typeof window!=='undefined'?window:globalThis);
