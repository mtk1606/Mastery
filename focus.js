/* Mastery Focus Learning Desk: deliberate-practice-first interface. */
(function focusApp(){
 'use strict';
 const core=window.MasteryFocusCore,key='mastery-focus-v1',root=document.getElementById('fRoot'),status=document.getElementById('fStatus');
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const safeRead=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
 const initial=()=>({format:key,run:0,attempts:[],due:{},active:null,completed:0,lastSummary:null});
 function load(){const v=safeRead(key);if(!v||v.format!==key||!Array.isArray(v.attempts))return initial();return {...initial(),...v,attempts:v.attempts.slice(-450),completed:Number.isSafeInteger(v.completed)?Math.max(0,v.completed):0};}
 let state=load();
 function message(text){if(status)status.textContent=String(text);}
 function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{status.textContent='Storage is unavailable. Download your record to retain it.'}}
 function getCurrent(){const a=state.active;return a?.tasks?.[a.position]||null;}
 function getDraft(){const a=state.active;if(!a)return null;a.answers??={};return a.answers[a.position]??(a.answers[a.position]={input:'',choice:'',result:null,hintUsed:false});}
 const days=ms=>Math.max(0,Math.ceil((ms-Date.now())/86400000));
 function insight(){
   const base=safeRead('axiom-studio-v2-progress')||{},readiness=safeRead('mastery-readiness-v1')?.state||{},cpp=safeRead('mastery-interview-cpp-phase9-v1')||{},arena=safeRead('mastery-phase10-v1')||{};
   const counts={lessons:Object.keys(base.reviewed||{}).filter(k=>base.reviewed[k]).length,exam:Object.keys(base.exams||{}).filter(k=>base.exams[k]).length,
   jsPasses:Object.values(readiness.reviews||{}).filter(v=>v&&v.verified===true).length,
   cppPasses:Object.values(cpp.records||{}).filter(v=>v&&Array.isArray(v.passedSeeds)&&new Set(v.passedSeeds).size>=2).length,
   mocks:(arena.sessions||[]).length,arenaStages:(arena.history||[]).filter(v=>v&&v.initialOk===true).length,
   readinessDue:Object.values(readiness.reviews||{}).filter(v=>v&&Number.isFinite(Number(v.next))&&Number(v.next)<=Date.now()).length};
   return {...counts,hasActiveArena:!!arena.session,hasReadinessSession:!!readiness.session};
 }
 function objective(){return state.attempts.filter(x=>x.correct).length;}
 function dueIds(){return core.topics.filter(t=>state.due[t.id]&&state.due[t.id]<=Date.now()).map(t=>t.id);}
 function signal(){const last=new Map();for(const x of state.attempts.slice(-80))last.set(x.id,x);const weak=[...last.entries()].filter(([,v])=>!v.correct);const top=weak.length?[weak[0][0],1]:null;return top?core.topics.find(t=>t.id===top[0]):null;}
 function renderOverview(){
   const x=insight(),due=dueIds(),weak=signal(),winRate=state.attempts.length?Math.round(100*objective()/state.attempts.length):null;
   const next=state.active?'Resume the 3-problem sprint':due.length?'Review due concepts':'Start a 3-problem sprint';
   const personal=weak?`Your next high-value target is <strong>${esc(weak.title)}</strong>, where recent attempts need reinforcement.`:'Start with an unfamiliar three-question mix. Every question includes a precise explanation and a transfer link.';
   return `<div class="f-headline"><div><p class="f-kicker">YOUR LEARNING DESK / FOCUS</p><h1>One clear win.<br><em>Then real mastery.</em></h1><p class="f-lead">Mastery is deep, but starting should be easy. Solve three meaningful questions, explain the principle, and see exactly what to revisit. No endless feed. No artificial points.</p>
   <div class="f-actions"><button class="f-primary" type="button" data-action="${state.active?'resume':'start'}">${esc(next)} <span aria-hidden="true">↗</span></button><a class="f-secondary" href="phase10.html">Enter the interview arena</a></div>
   <div class="f-submeta"><span>3 questions</span><span>About 5 minutes</span><span>No penalty for missed days</span></div></div>
   <div class="f-intro-art" aria-hidden="true"><div class="f-ring" style="--f-progress:${winRate===null?0:winRate}%"><div class="f-ring-inner"><b>${winRate===null?'—':winRate+'%'}</b><small>${winRate===null?'first-try checks':'fully correct'}</small></div></div><div class="f-orbit"><span>UNDERSTAND</span><span>RECALL</span><span>TRANSFER</span></div></div></div>
   <section class="f-section" aria-labelledby="fToday"><div class="f-section-head"><div><p class="f-kicker">PICK UP WHERE YOU LEFT OFF</p><h2 id="fToday">Your next move</h2></div><span class="f-quiet">Progress follows evidence, not screen time</span></div>
   <div class="f-next-grid">
     <article class="f-tile f-tile-feature"><span class="f-tile-icon">01 / FOCUS SPRINT</span><h3>${state.active?'Continue the attempt':due.length?'Recall what is due':'Get into flow in five minutes'}</h3><p>${personal}</p>
      <div class="f-meter"><span style="width:${state.active?Math.min(100,(state.active.position/3*100)):0}%"></span></div>
      <div class="f-tile-bottom"><span>${state.active?`${state.active.position} of 3 questions completed`:due.length?`${due.length} concept${due.length===1?'':'s'} due for review`:'Fresh numeric and concept checks'}</span><button type="button" data-action="${state.active?'resume':'start'}">Go to sprint <span aria-hidden="true">→</span></button></div></article>
     <a class="f-tile f-tile-link" href="${x.hasActiveArena?'phase10.html':'phase10.html'}"><span class="f-tile-icon">02 / MOCK INTERVIEW</span><h3>${x.hasActiveArena?'Resume your interview':'Try a full interview'}</h3><p>Role-specific rounds with dependent interviewer challenges and real coding tests.</p><div class="f-tile-bottom"><span>${x.mocks} completed simulations</span><span>Open arena ↗</span></div></a>
     <a class="f-tile f-tile-link" href="readiness.html#review"><span class="f-tile-icon">03 / RETRIEVAL</span><h3>${x.readinessDue?'Review the backlog':'Keep knowledge fresh'}</h3><p>Recall problems after a delay; correct code and self-rated explanations stay distinct.</p><div class="f-tile-bottom"><span>${x.readinessDue} Readiness reviews due</span><span>Open reviews ↗</span></div></a>
   </div></section>
   <section class="f-section"><div class="f-section-head"><div><p class="f-kicker">REAL LEARNING EVIDENCE</p><h2>Proof of work</h2></div><p class="f-quiet">Local records on this device · not a hiring-readiness score</p></div>
   <div class="f-stats"><div><b>${state.completed}</b><span>3-question sprints completed</span></div><div><b>${objective()} / ${state.attempts.length}</b><span>Fully correct Focus attempts</span></div><div><b>${x.jsPasses}</b><span>Readiness JS labs marked passed</span></div><div><b>${x.cppPasses}</b><span>C++20 labs with 2 passing seeds</span></div></div>
   <div class="f-note">Beyond Focus: ${x.lessons} Math/Quant lectures marked studied; ${x.exam} module examinations marked complete; ${x.arenaStages} Phase X initial answers checked correct. Each indicator measures a different activity and is deliberately not combined into a fake mastery score.</div></section>
   <section class="f-section"><div class="f-section-head"><div><p class="f-kicker">THE COMPLETE CAMPUS</p><h2>Go deeper when you're ready</h2></div><p class="f-quiet">Every lesson remains accessible</p></div>
   <div class="f-paths">
     <a href="index.html#/quant"><span>01 · QUANT</span><strong>Probability &amp; finance</strong><small>Expectation, Bayes, stopping problems, risk and trading</small><b aria-hidden="true">↗</b></a>
     <a href="index.html#/math"><span>02 · MATH</span><strong>Mathematical foundations</strong><small>Counting, calculus, linear algebra and inference</small><b aria-hidden="true">↗</b></a>
     <a href="engineering.html"><span>03 · BUILD</span><strong>Computer science</strong><small>Algorithms, memory, performance and systems design</small><b aria-hidden="true">↗</b></a>
     <a href="interview-cpp.html"><span>04 · COMPILE</span><strong>C++20 Interview Defense</strong><small>Real Clang/WASM tests and structured proof checks</small><b aria-hidden="true">↗</b></a>
     <a href="market-systems.html"><span>05 · SIMULATE</span><strong>Market systems</strong><small>Order books, deterministic replay, reliability and latency</small><b aria-hidden="true">↗</b></a>
     <a href="mock-interviews.html"><span>06 · EXPLAIN</span><strong>Original mock library</strong><small>Public source labels, timed reasoning and manual rubrics</small><b aria-hidden="true">↗</b></a>
   </div></section>
   <div class="f-bottom"><p>Study intentionally. Progress comes from correct reasoning, working implementations and recall after a delay—not from being kept on the page.</p><div><button type="button" data-action="export">Export Focus record</button><label class="f-import">Restore Focus record<input id="fImport" type="file" accept="application/json" hidden></label></div></div>`;
 }
 function renderSprint(){
   const a=state.active;if(!a)return renderOverview();
   const t=getCurrent(),d=getDraft(),k=a.position;
   return `<div class="f-sprint-top"><p class="f-kicker">ACTIVE RECALL / ROUND ${a.run}</p><button type="button" class="f-text-button" data-action="leave">Back to learning desk</button></div>
   <h1 class="f-sprint-title">Show your thinking.<br><em>One question at a time.</em></h1>
   <div class="f-sprint-progress" role="progressbar" aria-label="Sprint questions completed" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${k}"><span style="width:${k/3*100}%"></span></div>
   <div class="f-question-meta"><span>QUESTION ${k+1} / 3</span><span>${esc(t.category)} · ${esc(t.title)}</span><span>~90 seconds</span></div>
   <article class="f-question-card"><p class="f-kicker">INTERVIEW ARCHETYPE</p><h2>${esc(t.title)}</h2><p class="f-question">${esc(t.prompt)}</p>
   <div class="f-step-columns"><div class="f-response"><label for="fAnswer">Your numerical answer ${t.unit?`<span>(${esc(t.unit)})</span>`:''}</label>
   <input id="fAnswer" type="text" inputmode="decimal" autocomplete="off" placeholder="Enter a number" value="${esc(d.input)}" ${d.result?'disabled':''}>
   <details class="f-hint"><summary>Need a direction? Reveal a recognition hint</summary><p>${esc(t.cue)}</p><p class="f-muted">Using a hint is allowed. Try to reconstruct the equation yourself.</p></details></div>
   <div class="f-reasoning"><fieldset ${d.result?'disabled':''}><legend>Why is this the right approach?</legend>${t.why.map((option,i)=>`<label class="f-choice"><input type="radio" name="fWhy" value="${i}" ${String(d.choice)===String(i)?'checked':''}><span>${esc(option)}</span></label>`).join('')}</fieldset></div></div>
   ${d.result?`<div id="fFeedback" class="f-feedback ${d.result.correct?'good':'review'}" role="status"><span class="f-feedback-mark" aria-hidden="true">${d.result.correct?'✦':'↻'}</span><div><h3>${d.result.correct?(d.result.assisted?'Both checks correct with a hint.':'Both checks correct. That skill is getting stronger.'):'Useful attempt. Here is the precise correction.'}</h3>
   <p><b>Numeric check:</b> ${d.result.numeric?'Correct':'Revise'} · <b>Principle:</b> ${d.result.concept?'Correct':'Revise'}</p>
   <p>${esc(t.solution)}</p><p><b>Trap to remember:</b> ${esc(t.trap)}</p><a href="${esc(t.link)}">Study the full lesson ↗</a></div></div>
   <div class="f-actions"><button type="button" class="f-primary" data-action="next">${k===2?'See your sprint recap':'Next challenge →'}</button></div>`
   :`<p class="f-muted">We check the number and the reasoning separately. The answer is only revealed after you commit.</p>
   <div class="f-actions"><button type="button" class="f-primary" data-action="check">Check my reasoning <span aria-hidden="true">→</span></button></div>`}
   </article><p class="f-small">Original Mastery questions. This short sprint checks finite objective answers and selected conceptual claims; it cannot grade unrestricted proofs, speaking or hiring readiness.</p>`;
 }
 function renderSummary(){
   const summary=state.lastSummary;
   if(!summary||!Array.isArray(summary.results))return renderOverview();
   const correct=summary.results.filter(x=>x.correct).length;
   const mismatches=summary.results.filter(x=>!x.correct);
   return `<div class="f-celebrate ${correct===3?'f-perfect':''}"><div class="f-sunburst" aria-hidden="true">✳</div><p class="f-kicker">SPRINT ${summary.run} COMPLETE · ${summary.results.length} QUESTIONS</p><h1>${correct===3?'Strong work. Now retain it.':'One more layer of understanding.'}</h1>
   <p class="f-lead">${correct}/3 questions had both the numerical result and the method correct. A revisit is scheduled to test what survives after a delay, without punishing missed days.</p>
   <div class="f-award">${correct} <span>/ 3 full checks</span></div></div>
   <section class="f-section"><h2>Your learning receipt</h2><div class="f-receipts">${summary.results.map(x=>{const t=core.topics.find(y=>y.id===x.id);return `<div><span class="${x.correct?'f-dot-good':'f-dot-review'}">${x.correct?'✓':'↻'}</span><div><strong>${esc(t?.title||x.id)}</strong><small>Numerical ${x.numeric?'✓':'needs review'} · Conceptual ${x.concept?'✓':'needs review'}${x.assisted?' · Hint used':''}</small></div><a href="${esc(t?.link||'index.html#')}">Open lesson ↗</a></div>`}).join('')}</div>
    ${mismatches.length?`<p class="f-nextnote">To get stronger, prioritize ${mismatches.map(x=>core.topics.find(y=>y.id===x.id)?.title).filter(Boolean).join(' and ')} in your next retrieval session.</p>`:'<p class="f-nextnote">All three checks passed. Try a fresh problem mix or return after the scheduled review interval for deeper recall.</p>'}
   <div class="f-actions"><button type="button" data-action="overview" class="f-primary">Back to learning desk</button><button type="button" data-action="start">Practice a different mix</button></div></section>`;
 }
 function render(){
   if(!root)return;
   root.innerHTML=state.active&&state.screen==='sprint'?renderSprint():state.screen==='summary'?renderSummary():renderOverview();
   document.querySelectorAll('[data-focus-nav]').forEach(el=>el.setAttribute('aria-current',String(state.screen===el.dataset.focusNav)));
 }
 function go(screen){state.screen=screen;save();render();window.scrollTo({top:0,behavior:'instant'});}
 function start(){
  if(state.active){if(!confirm('Replace the unfinished sprint? Your submitted answers remain in the record.'))return;}
  state.run=Math.max(0,Number(state.run)||0)+1;
  const ids=dueIds(),tasks=core.plan(state.run,state.attempts,ids);
  state.active={run:state.run,tasks,position:0,answers:{},started:Date.now()};
  go('sprint');message('Sprint started. Commit a number and one reasoning choice for each question.');
 }
 function check(){
  const a=state.active,t=getCurrent(),d=getDraft();
  if(!a||!t||d.result)return;
  const number=core.grade(d.input,t.answer);
  if(!number.valid){message(number.message);document.getElementById('fAnswer')?.focus();return;}
  if(!/^[012]$/.test(String(d.choice))){message('Select the reasoning statement that makes your method valid.');return;}
  const numeric=number.ok,concept=Number(d.choice)===t.correct,correct=numeric&&concept;
  d.result={numeric,concept,correct,assisted:!!d.hintUsed,checkedAt:Date.now()};
  const attempt={id:t.id,run:a.run,position:a.position,seed:t.seed,numeric,concept,correct,assisted:!!d.hintUsed,at:Date.now()};
  if(!state.attempts.some(v=>v.run===a.run&&v.position===a.position))state.attempts.push(attempt);
  state.attempts=state.attempts.slice(-450);
  state.due[t.id]=Date.now()+(correct&&!d.hintUsed?3:1)*86400000;
  save();render();message(correct?'Two checks correct. Explanation ready below.':'Feedback is ready; inspect your specific mistake.');
  document.getElementById('fFeedback')?.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function next(){
  const a=state.active,d=getDraft();if(!a||!d?.result)return;
  if(a.position<2){a.position++;save();render();document.getElementById('fAnswer')?.focus();return;}
  const results=a.tasks.map((t,i)=>({id:t.id,...a.answers[i]?.result})).filter(x=>typeof x.correct==='boolean');
  state.lastSummary={run:a.run,results,at:Date.now()};
  state.completed=(Number(state.completed)||0)+1;
  state.active=null;go('summary');message('Sprint complete. Each concept is scheduled for future retrieval.');
 }
 function exportState(){
  save();const obj={format:key,exportedAt:new Date().toISOString(),data:state},b=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download='mastery-focus-progress.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);message('Focus record exported.');
 }
 async function restore(file){
   if(!file)return;
   try{if(file.size>2e6)throw Error('File exceeds 2 MB');const x=JSON.parse(await file.text());
    if(x?.format!==key||x?.data?.format!==key||!Array.isArray(x.data.attempts)||!Number.isSafeInteger(x.data.run))throw Error('Invalid Focus backup');
    if(!confirm('Replace this device’s Focus record with the imported backup?'))return;
    const ids=new Set(core.topics.map(t=>t.id));
    const attempts=x.data.attempts.filter(v=>v&&ids.has(v.id)&&Number.isSafeInteger(v.run)&&typeof v.correct==='boolean'&&typeof v.numeric==='boolean'&&typeof v.concept==='boolean'&&Number.isFinite(v.at)).slice(-450);
    const due={};for(const [id,v] of Object.entries(x.data.due||{}))if(ids.has(id)&&Number.isFinite(v)&&v>0)due[id]=v;
    state={...initial(),run:Math.max(0,x.data.run),attempts,due,completed:Number.isSafeInteger(x.data.completed)?Math.max(0,x.data.completed):0};
    go('overview');message('Validated Focus progress restored. Unfinished sessions are excluded for safety.');
   }catch(e){message('Unable to restore: '+String(e.message||e).slice(0,160));}
 }
 document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-action]');if(!btn)return;
  const act=btn.dataset.action;
  if(act==='start')start();
  else if(act==='resume')go('sprint');
  else if(act==='leave'||act==='overview')go('overview');
  else if(act==='check')check();
  else if(act==='next')next();
  else if(act==='export')exportState();
 });
 document.addEventListener('input',e=>{if(!state.active)return;if(e.target.id==='fAnswer'){getDraft().input=e.target.value.slice(0,100);save();}});
 document.addEventListener('change',e=>{if(state.active&&e.target.name==='fWhy'){getDraft().choice=e.target.value;save();}});
 document.addEventListener('toggle',e=>{if(e.target?.classList?.contains('f-hint')&&e.target.open&&state.active&&!getDraft()?.result){getDraft().hintUsed=true;save();}},true);
 document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='fAnswer'&&!getDraft()?.result){e.preventDefault();check();}});
 document.addEventListener('change',e=>{if(e.target.id==='fImport'){restore(e.target.files?.[0]);e.target.value='';}});
 if(state.active&&state.screen!=='overview')state.screen='sprint';
 render();
})();
