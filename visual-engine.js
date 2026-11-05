/* Phase XIV: original, lightweight, accessible SVG learning scenes.
 * Renderers are deterministic; every SVG has a useful text counterpart.
 * Visual playback is never a learning-grade signal. No external graphics or animations. */
(function(root){
'use strict';
const bank=(root.MasteryVisualScenes||typeof module!=='undefined'&&require('./visual-scenes.js'));
if(!bank||!bank.validate())throw Error('Visual scene definitions failed validation');
const math=root.MasteryMathVisuals||(typeof module!=='undefined'&&require('./visual-math.js'));
const mathRenderer=root.MasteryMathRender||(typeof module!=='undefined'&&require('./visual-math-render.js'));
const systems=root.MasterySystemsVisuals||(typeof module!=='undefined'&&require('./visual-systems.js'));
const systemsRenderer=root.MasterySystemsRender||(typeof module!=='undefined'&&require('./visual-systems-render.js'));
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N=x=>Number.isFinite(Number(x))?Number(x):0;
const R=(x,y,w,h,cls='mv-node',rx=13)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
const T=(x,y,txt,cls='mv-label',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${escape(txt)}</text>`;
const L=(x1,y1,x2,y2,cls='mv-line')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
const C=(x,y,r,cls='mv-node')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
const P=(d,cls='mv-line')=>`<path d="${d}" class="${cls}"/>`;
const frameSVG=(scene,frame,inner)=>{
 const t='mvTitle',d='mvDesc';
 return `<svg class="mv-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 350" role="img" aria-labelledby="${t} ${d}" preserveAspectRatio="xMidYMid meet">
 <title id="${t}">${escape(scene.title)}: ${escape(frame.label)}</title>
 <desc id="${d}">${escape(frame.explain)}</desc>
 <defs><marker id="mvArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" class="mv-arrow-head"/></marker></defs>
 ${inner}</svg>`;
};
const stamp=(label,value,y)=>R(675,y,198,61,'mv-value-panel')+T(690,y+22,label,'mv-kicker')+T(690,y+49,value,'mv-value');
function renderBindings(f){
 const names=f.names||[],objects=f.objects||[],targets=new Map();
 let out=T(42,30,'VARIABLE NAMES','mv-kicker')+T(568,30,'OBJECTS IN MEMORY','mv-kicker');
 objects.forEach((item,i)=>{const y=53+i*70;targets.set(item[0],{x:555,y:y+27});out+=R(555,y,310,54,item[2]==='integer'?'mv-integer':'mv-object');
 out+=T(575,y+22,item[0],'mv-kicker')+T(575,y+44,item[1],'mv-strong');});
 names.forEach(([label,id],i)=>{const y=64+i*68;out+=R(55,y,220,49,'mv-name')+T(75,y+31,label,'mv-strong');
  const target=targets.get(id);if(target)out+=P(`M 279 ${y+25} C 384 ${y+25}, 455 ${target.y}, 545 ${target.y}`,'mv-arrow');});
 objects.forEach((item,i)=>{const target=item[3]?targets.get(item[3]):null;if(target){const y=53+i*70+28;out+=P(`M 795 ${y} C 880 ${y}, 880 ${target.y}, 795 ${target.y}`,'mv-link');}});
 out+=T(44,323,'An arrow means a reference — not an automatic deep copy.','mv-note');
 return out;
}
function renderContract(f){
 let out='',labels=['Input','Output','Empty','Mutation','Bound'];
 labels.forEach((label,i)=>{const col=i%2,row=Math.floor(i/2),x=44+col*432,y=42+row*93;
  const active=f.active===label;
  out+=R(x,y,396,76,active?'mv-selected':'mv-node');
  out+=T(x+16,y+26,label.toUpperCase(),'mv-kicker')+T(x+16,y+56,f.values[label],'mv-strong');});
 return out+T(45,334,'A correct algorithm must satisfy each declared field of the contract.','mv-note');
}
function renderCompare(f){
 let out=R(58,36,804,49,'mv-input')+T(82,67,f.input,'mv-strong');
 out+=R(58,113,381,174,'mv-bad-panel')+R(461,113,401,174,'mv-good-panel');
 out+=T(83,148,'INCORRECT SHORTCUT','mv-bad-label')+T(83,210,f.wrong,f.wrong.length>24?'mv-emphasis-compact':'mv-emphasis');
 out+=T(490,148,'VALID CONTRACT / REPAIR','mv-good-label')+T(490,210,f.right,f.right.length>24?'mv-emphasis-compact':'mv-emphasis');
 return out+T(62,326,'Compare the claimed output with the set of valid answers.','mv-note');
}
function renderFlow(f){
 let out='',nodes=f.nodes||[];
 nodes.forEach((label,i)=>{const x=52+i*296,selected=f.active===i;
 out+=R(x,79,258,140,selected?'mv-selected':'mv-node');
 out+=T(x+16,111,'0'+(i+1),'mv-kicker')+T(x+129,172,label,'mv-flow-label','middle');
 if(i<2)out+=P(`M ${x+260} 149 L ${x+294} 149`,'mv-arrow');});
 out+=R(65,252,790,52,'mv-output')+T(88,285,f.foot,'mv-note');
 return out;
}
function renderCapacity(f){
 let out=T(48,35,'DYNAMIC ARRAY ALLOCATION','mv-kicker')+T(48,75,'Physical slots','mv-subtitle');
 const n=f.capacity;
 for(let i=0;i<n;i++){const w=94,space=10,x=48+i*(w+space),y=108;
  out+=R(x,y,w,95,i<f.used?'mv-selected':'mv-empty',8);
  out+=T(x+47,y+56,i<f.used?'item '+(i+1):'empty','mv-cell','middle');}
 out+=stamp('LENGTH',f.used,239)+R(48,237,190,61,'mv-value-panel')+T(62,260,'CAPACITY','mv-kicker')+T(62,292,f.capacity,'mv-value');
 out+=R(257,237,190,61,'mv-value-panel')+T(273,260,'COPIES THIS APPEND','mv-kicker')+T(273,292,f.copied,'mv-value');
 out+=R(467,237,190,61,'mv-value-panel')+T(484,260,'TOTAL COPIES','mv-kicker')+T(484,292,f.totalCopies,'mv-value');
 return out;
}
function renderHash(f){
 let out=T(52,39,'INCOMING EVENT STREAM','mv-kicker')+T(550,39,'DICTIONARY STATE','mv-kicker');
 (f.events||[]).forEach((k,i)=>{const x=59+i*125,y=90;out+=R(x,y,105,87,i<f.processed?'mv-selected':'mv-node');
 out+=T(x+52,y+39,k,'mv-flow-label','middle')+T(x+52,y+66,i<f.processed?'processed':'pending','mv-kicker','middle');});
 out+=P('M 460 135 L 523 135','mv-arrow');
 const items=Object.entries(f.counts||{});
 if(!items.length){out+=R(541,80,297,91,'mv-node')+T(689,131,'{}  empty','mv-flow-label','middle');}
 items.forEach(([key,count],i)=>{const y=83+i*101;out+=R(543,y,284,86,'mv-selected')+T(570,y+27,'KEY: '+key,'mv-kicker')+T(570,y+61,'count = '+count,'mv-flow-label');});
 out+=T(52,301,'Invariant: Σ counts = '+f.processed+' processed events.','mv-strong');
 return out;
}
function renderWindow(f){
 const values=f.values||[],k=f.k||2,left=f.left||0,dx=116,w=89;
 let out=T(52,35,'CONTIGUOUS FIXED-SIZE WINDOW','mv-kicker');
 values.forEach((v,i)=>{const x=80+i*dx,active=i>=left&&i<left+k;
 out+=R(x,90,w,91,active?'mv-selected':'mv-node',9);
 out+=T(x+w/2,138,v,'mv-flow-label','middle')+T(x+w/2,166,'i='+i,'mv-kicker','middle');});
 out+=P(`M ${80+left*dx} 197 L ${80+left*dx+((k-1)*dx+w)} 197`,'mv-focus-line');
 out+=T(80+left*dx,223,'left = '+left+' / k = '+k,'mv-kicker');
 out+=stamp('WINDOW SUM',f.total,73)+stamp('BEST SO FAR',f.best,163);
 const transition=f.out===null?'First valid window':`Remove ${f.out} · add ${f.in}`;
 out+=T(58,303,transition,'mv-strong');
 return out;
}
function renderBinary(f){
 const vals=f.values||[],lo=f.lo,hi=f.hi,dx=110,w=85;
 let out=T(50,35,'LOWER BOUND · HALF-OPEN [lo, hi)','mv-kicker')+T(618,36,'TARGET: '+f.target,'mv-strong');
 vals.forEach((v,i)=>{const x=69+i*dx,inRange=i>=lo&&i<hi;
  out+=R(x,101,w,88,f.mid===i?'mv-selected':inRange?'mv-node':'mv-empty',7);
  out+=T(x+w/2,148,v,'mv-flow-label','middle')+T(x+w/2,174,'i='+i,'mv-kicker','middle');
  if(f.mid===i)out+=T(x+w/2,88,'mid','mv-focus-text','middle');
 });
 out+=P(`M ${69+lo*dx} 207 L ${69+hi*dx-25} 207`,'mv-focus-line');
 out+=R(58,248,235,58,'mv-value-panel')+T(77,270,'LO / HI','mv-kicker')+T(77,295,lo+' / '+hi,'mv-strong');
 out+=R(322,248,243,58,'mv-value-panel')+T(339,270,'MIDPOINT','mv-kicker')+T(339,295,f.mid===null?'stop':f.mid,'mv-strong');
 out+=R(595,248,268,58,f.result!==null?'mv-selected':'mv-value-panel')+T(615,270,'FIRST MATCH','mv-kicker')+T(615,295,f.result===null?'not decided':f.result,'mv-strong');
 return out;
}
function renderBFS(f){
 const nodes={A:[120,135],B:[350,73],C:[350,231],D:[599,145]},edges=[['A','B'],['A','C'],['B','D'],['C','D']];
 let out=T(42,32,'GRAPH · UNWEIGHTED EDGES','mv-kicker');
 edges.forEach(([a,b])=>{out+=L(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1],'mv-edge');});
 for(const [id,p] of Object.entries(nodes)){const visited=f.visited.includes(id),queued=f.queue.includes(id),active=id===f.active;
  out+=C(p[0],p[1],32,active?'mv-selected':visited?'mv-visited':queued?'mv-queued':'mv-node');
  out+=T(p[0],p[1]+8,id,'mv-flow-label','middle');
  if(Number.isInteger(f.distance[id]))out+=T(p[0],p[1]+57,'d='+f.distance[id],'mv-kicker','middle');
 }
 out+=R(60,267,800,54,'mv-output')+T(79,289,'FIFO QUEUE / NEXT','mv-kicker')+T(79,310,f.queue.length?f.queue.join('   →   '):'(empty: traversal finished)','mv-strong');
 return out;
}
function renderDP(f){
 const dp=f.dp||[],dx=120,w=95;
 let out=T(53,35,'COIN COMBINATIONS · target 5','mv-kicker')+T(53,69,'ALLOWED COINS: '+(f.coins.length?f.coins.join(', '):'none'),'mv-strong');
 dp.forEach((v,i)=>{const x=60+i*dx,selected=i===f.focus;
 out+=R(x,112,w,103,selected?'mv-selected':'mv-node',8);
 out+=T(x+47,142,'amount '+i,'mv-kicker','middle')+T(x+47,185,v,'mv-flow-label','middle');});
 out+=R(60,252,720,59,'mv-output')+T(83,277,'dp[s] = number of UNORDERED combinations to make s','mv-note');
 out+=T(83,299,'Process coins outside, amounts ascending inside.','mv-strong');
 return out;
}
const renderShape=(s,f)=>{
 const fn={bindings:renderBindings,contract:renderContract,compare:renderCompare,flow:renderFlow,capacity:renderCapacity,hash:renderHash,window:renderWindow,binary:renderBinary,bfs:renderBFS,dp:renderDP}[s.kind];
 if(!fn&&mathRenderer?.kinds.includes(s.kind))return frameSVG(s,f,mathRenderer.render(s,f,{R,T,L,C,P}));
 if(!fn&&systemsRenderer?.kinds.includes(s.kind))return frameSVG(s,f,systemsRenderer.render(s,f,{R,T,L,C,P}));
 if(!fn)throw Error('Unknown visual '+s.kind);
 return frameSVG(s,f,fn(f));
};
/* Playback UI and deliberately non-credit-bearing prediction probes. */
const defaults={window:2,binary:2,induction:4,bayes:1,indicators:3,sampling:{n:100,p:.5},matrix:{transform:'shear',vector:'2,1'},gradient:.1,dedup:{tape:'duplicate',dedup:'durable'},review:'negative',latency:'tail',transaction:{transaction:'atomic',failure:'crash'},retry:'stable',race:'unsafe'};
let active=null,playTimer=null;
const positions=new Map();
function stop(){if(playTimer){clearInterval(playTimer);playTimer=null;}}
function windowFrames(k){
 const values=[1,2,3,4],frames=[];let best=-Infinity;
 for(let left=0;left<=values.length-k;left++){
  const total=values.slice(left,left+k).reduce((a,b)=>a+b,0);best=Math.max(best,total);
  frames.push({label:left?'Slide to interval '+left:'Initialize a valid window',explain:left?
   'The window moves right by one position: subtract '+values[left-1]+' and add '+values[left+k-1]+'. The new sum is '+total+', and the best seen is '+best+'.':
   'The initial k='+k+' elements sum to '+total+'. A maximum must begin with a real valid window, even when all inputs are negative.',
   values,k,left,total,best,out:left?values[left-1]:null,in:left?values[left+k-1]:null});
 }
 return frames;
}
function binaryFrames(target){
 const values=[1,2,2,2,5],frames=[];let lo=0,hi=values.length;
 while(lo<hi){
  const mid=Math.floor((lo+hi)/2),qualifies=values[mid]>=target;
  frames.push({label:'Compare midpoint '+mid+' against target '+target,
   explain:'Current half-open interval ['+lo+', '+hi+'); midpoint '+mid+' contains '+values[mid]+'. '+(qualifies?'It is at least the target, so the first qualifying index is at or before mid; set hi=mid.':'It is below target, so all positions through mid fail; set lo=mid+1.'),
   values,target,lo,hi,mid,result:null});
  if(qualifies)hi=mid;else lo=mid+1;
 }
 const result=lo<values.length&&values[lo]===target?lo:-1;
 frames.push({label:result<0?'No exact match for '+target:'First exact match occurs at '+result,
  explain:'The monotone predicate nums[i] >= '+target+' first becomes true at index '+lo+'. '+(result>=0?'Verify equality: nums['+lo+'] is '+target+', so return '+lo+'.':'No element equals '+target+' at that lower bound; return -1.'),
  values,target,lo,hi,mid:null,result});
 return frames;
}
function framesFor(s,state){
 if(mathRenderer?.kinds.includes(s.kind))return math.framesFor(s,state.param);
 if(systemsRenderer?.kinds.includes(s.kind))return systems.framesFor(s,state.param);
 if(s.kind==='window'&&state.param!==defaults.window)return windowFrames(state.param);
 if(s.kind==='binary'&&state.param!==defaults.binary)return binaryFrames(state.param);
 return s.frames;
}
const control=(value,label,disabled=false)=>`<button type="button" class="mv-btn" data-mv-action="${value}" ${disabled?'disabled':''}>${label}</button>`;
function optionsHTML(scene,choice,param){
 const q=systemsRenderer?.kinds.includes(scene.kind)?systems.challengeFor(scene,param):math?.challengeFor?.(scene,param)||scene.challenge,answered=choice!==null,correct=answered&&choice===q.answer;
 return `<div class="mv-prediction" aria-label="Predict the next concept">
 <div class="mv-prediction-head"><span class="mv-kicker-html">TEST YOUR PREDICTION</span><span class="mv-small">Not graded · original example</span></div>
 <p class="mv-question">${escape(q.question)}</p>
 <div class="mv-option-row" role="group" aria-label="Choose your prediction">
 ${q.options.map((o,i)=>`<button type="button" class="mv-option" data-mv-action="answer" data-mv-choice="${i}" aria-pressed="${choice===i}" ${answered?'disabled':''}>${escape(o)}</button>`).join('')}
 </div>
 ${answered?`<div class="mv-feedback" role="status"><strong>${correct?'Correct prediction.':'Review the underlying invariant.'}</strong>
 <p>${escape(q.why)}</p><button type="button" class="mv-text-button" data-mv-action="answer-reset">Try prediction again</button></div>`:''}
 </div>`;
}
function textSteps(s,frames,at){
 return `<ol class="mv-steps" aria-label="Full accessible state trace">
 ${frames.map((f,i)=>`<li class="mv-step ${at===i?'is-active':''}"><strong>${escape(f.label)}</strong><p>${escape(f.explain)}</p></li>`).join('')}</ol>`;
}
const selectField=(label,key,items,current)=>`<label class="mv-param-label">${escape(label)}
<select data-mv-param="${escape(key)}" aria-label="${escape(label)}">${items.map(([value,name])=>`<option value="${escape(value)}" ${String(current)===String(value)?'selected':''}>${escape(name)}</option>`).join('')}</select></label>`;
function paramHTML(s,param){
 if(s.kind==='dedup')return selectField('Input event tape','sys-tape',systems.allowed.tape.map(x=>[x,x==='duplicate'?'Same-ID replay':'Conflicting-ID payload']),param.tape)
  +selectField('Replay processing policy','sys-dedup',systems.allowed.dedup.map(x=>[x,x==='durable'?'Persist processed IDs':'Unsafe count every delivery']),param.dedup);
 if(s.kind==='review')return selectField('Try a regression fixture','sys-fixture',systems.allowed.fixture.map(x=>[x,x==='negative'?'[-3, -1], k=1':'[2, 4], k=1']),param);
 if(s.kind==='latency')return selectField('Synthetic observation window','sys-workload',systems.allowed.workload.map(x=>[x,x==='steady'?'20 × 20ms':x==='tail'?'19 × 20ms, 1 × 400ms':'100 mixed requests']),param);
 if(s.kind==='transaction')return selectField('Transaction protection','sys-transaction',systems.allowed.transaction.map(x=>[x,x==='atomic'?'Atomic grouped writes':'Unsafe independent writes']),param.transaction)
 +selectField('Execution outcome','sys-failure',systems.allowed.failure.map(x=>[x,x==='crash'?'Crash before credit':'Successful completion']),param.failure);
 if(s.kind==='retry')return selectField('Key used on retry','sys-retry',systems.allowed.retry.map(x=>[x,x==='stable'?'Reuse same key':'New key (duplicate risk)']),param);
 if(s.kind==='race')return selectField('Shared counter protocol','sys-race',systems.allowed.race.map(x=>[x,x==='unsafe'?'Unprotected read/modify/write':'Lock serializes increments']),param);
 if(s.kind==='induction')return selectField('Prove a different induction step','induction',math.choices.induction.map(n=>[n,'n = '+n]),param);
 if(s.kind==='bayes')return selectField('Change condition prevalence (sensitivity 90%, false-positive rate 10%)','bayes',math.choices.bayes.map(p=>[p,'Prior '+p+'%']),param);
 if(s.kind==='indicators')return selectField('Change the number of red balls among five','indicators',math.choices.indicators.map(n=>[n,n+' red · '+(5-n)+' blue']),param);
 if(s.kind==='sampling')return selectField('Independent sample size','sampling-n',math.choices.samplingN.map(n=>[n,'n = '+n]),param.n)+selectField('Bernoulli success probability','sampling-p',math.choices.samplingP.map(p=>[p,'p = '+p]),param.p);
 if(s.kind==='matrix')return selectField('Change the linear transformation','matrix-transform',math.choices.matrix.map(n=>[n,n]),param.transform)+selectField('Change input vector','matrix-vector',math.choices.matrixVector.map(x=>[x,'v = ('+x+')']),param.vector);
 if(s.kind==='gradient')return selectField('Experiment with learning rate η','gradient',math.choices.gradient.map(x=>[x,'η = '+x]),param);
 if(s.kind==='window')return `<label class="mv-param-label">Try changing the window size:
 <select data-mv-param="window" aria-label="Sliding-window width">${[1,2,3,4].map(k=>`<option value="${k}" ${param===k?'selected':''}>k = ${k}</option>`).join('')}</select></label>`;
 if(s.kind==='binary')return `<label class="mv-param-label">Try another search target:
 <select data-mv-param="binary" aria-label="Sorted-array binary-search target">${[0,1,2,3,4,5,6].map(k=>`<option value="${k}" ${param===k?'selected':''}>target = ${k}</option>`).join('')}</select></label>`;
 return '';
}
function draw(){
 if(!active)return;
 const {host,scene,state}=active,frames=framesFor(scene,state);
 state.index=Math.max(0,Math.min(frames.length-1,state.index));
 const f=frames[state.index],last=state.index===frames.length-1;
 host.hidden=false;
 host.innerHTML=`<section class="mv" aria-labelledby="mvHeading">
 <div class="mv-top"><div><div class="mv-eyebrow">VISUAL LAB · ${escape(scene.kind.toUpperCase())}</div><h4 id="mvHeading">${escape(scene.title)}</h4><p>${escape(scene.purpose)}</p></div>
 <div class="mv-mode-toggle" role="group" aria-label="Visual learning presentation">
 <button type="button" data-mv-action="mode-visual" aria-pressed="${state.mode==='visual'}">Diagram</button>
 <button type="button" data-mv-action="mode-text" aria-pressed="${state.mode==='text'}">Text trace</button></div></div>
 <div class="mv-canvas" data-mv-canvas>
 ${state.mode==='text'?textSteps(scene,frames,state.index):renderShape(scene,f)}
 </div>
 <div class="mv-motion">
 <div class="mv-motion-details"><span class="mv-count" aria-label="Step ${state.index+1} of ${frames.length}">${String(state.index+1).padStart(2,'0')} <span>/ ${String(frames.length).padStart(2,'0')}</span></span>
 <div class="mv-timeline" role="progressbar" aria-valuemin="1" aria-valuemax="${frames.length}" aria-valuenow="${state.index+1}" aria-label="Current scene step"><span style="width:${100*(state.index+1)/frames.length}%"></span></div></div>
 <div class="mv-controls">${control('previous','← Previous',state.index===0)}
 ${control('next','Next step →',last)}
 ${control('play',playTimer?'Pause':'Play',false)}
 ${control('replay','Replay',false)}</div></div>
 <div class="mv-explanation" aria-live="polite" aria-atomic="true"><div class="mv-explanation-label">WHAT CHANGED AT THIS STEP</div>
 <strong>${escape(f.label)}</strong><p>${escape(f.explain)}</p></div>
 ${paramHTML(scene,state.param)}
 ${optionsHTML(scene,state.choice,state.param)}
 <div class="mv-footer"><span><strong>Textbook principle:</strong> ${escape(scene.source)}. Original diagram, not a reproduced textbook figure.</span>
 <span>Motion is user-controlled; predicted answers earn no mastery credit.</span></div>
 </section>`;
}
function mount(host,id){
 stop();
 if(!host)return;
 const scene=bank.lookup(id);
 if(!scene){active=null;host.hidden=true;host.innerHTML='';return;}
 let state=positions.get(id);
 if(!state){state={index:0,mode:'visual',choice:null,param:defaults[scene.kind]??null};positions.set(id,state);}
 active={host,scene,state};
 if(!host.dataset.mvAttached){
  host.dataset.mvAttached='true';
  host.addEventListener('click',event=>{
   if(!active||active.host!==host)return;
   const button=event.target.closest('button[data-mv-action]');if(!button||button.disabled)return;
   const cmd=button.dataset.mvAction,s=active.state,frames=framesFor(active.scene,s);
   if(cmd==='previous'){stop();s.index=Math.max(0,s.index-1);}
   else if(cmd==='next'){stop();s.index=Math.min(frames.length-1,s.index+1);}
   else if(cmd==='replay'){stop();s.index=0;}
   else if(cmd==='play'){
    if(playTimer)stop();
    else{
     if(s.index>=frames.length-1)s.index=0;
     playTimer=setInterval(()=>{
      if(!active||active.host!==host){stop();return;}
      const framesNow=framesFor(active.scene,active.state);
      if(active.state.index>=framesNow.length-1){stop();draw();return;}
      active.state.index++;draw();
     },3000);
    }
   }else if(cmd==='mode-visual'||cmd==='mode-text'){s.mode=cmd==='mode-visual'?'visual':'text';}
   else if(cmd==='answer'){s.choice=Number(button.dataset.mvChoice);}
   else if(cmd==='answer-reset'){s.choice=null;}
   draw();
  });
  host.addEventListener('change',event=>{
   if(!active||active.host!==host)return;
   const p=event.target.dataset.mvParam,raw=event.target.value,k=Number(raw),current=active.state.param;
   let next=null;
   if(p==='window'&&Number.isInteger(k)&&k>=1&&k<=4)next=k;
   else if(p==='binary'&&[0,1,2,3,4,5,6].includes(k))next=k;
   else if(['induction','bayes','indicators','gradient'].includes(p)&&math.choices[p]?.includes(k))next=k;
   else if(p==='sampling-n'&&math.choices.samplingN.includes(k))next={...current,n:k};
   else if(p==='sampling-p'&&math.choices.samplingP.includes(k))next={...current,p:k};
   else if(p==='matrix-transform'&&math.choices.matrix.includes(raw))next={...current,transform:raw};
   else if(p==='matrix-vector'&&math.choices.matrixVector.includes(raw))next={...current,vector:raw};
   else if(p==='sys-tape'&&systems.allowed.tape.includes(raw))next={...current,tape:raw};
   else if(p==='sys-dedup'&&systems.allowed.dedup.includes(raw))next={...current,dedup:raw};
   else if(p==='sys-fixture'&&systems.allowed.fixture.includes(raw))next=raw;
   else if(p==='sys-workload'&&systems.allowed.workload.includes(raw))next=raw;
   else if(p==='sys-transaction'&&systems.allowed.transaction.includes(raw))next={...current,transaction:raw};
   else if(p==='sys-failure'&&systems.allowed.failure.includes(raw))next={...current,failure:raw};
   else if(p==='sys-retry'&&systems.allowed.retry.includes(raw))next=raw;
   else if(p==='sys-race'&&systems.allowed.race.includes(raw))next=raw;
   if(next!==null){
    stop();active.state.param=next;active.state.index=0;active.state.choice=null;draw();
   }
  });
 }
 draw();
}
const api={mount,renderShape,framesFor,windowFrames,binaryFrames,stop,sceneCount:bank.scenes.length};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.MasteryVisuals=api;
})(typeof window!=='undefined'?window:globalThis);
