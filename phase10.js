/* Mastery Phase X: adaptive scripted interview and evidence-aware scoring. */
(function phase10App(){
 'use strict';
 const core=window.Phase10Engine,KEY='mastery-phase10-v1',root=document.getElementById('xRoot'),status=document.getElementById('xStatus');
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const defaults=()=>({format:'mastery-phase10-v1',run:0,view:'setup',history:[],sessions:[],session:null});
 function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v?.format==='mastery-phase10-v1'&&Array.isArray(v.history)&&Array.isArray(v.sessions))return {...defaults(),...v,history:v.history.slice(-300),sessions:v.sessions.slice(-60)}}catch{}return defaults();}
 let state=load(),worker=null,watchdog=null;
 function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{status.textContent='Browser storage unavailable. Export your work to retain it.'}}
 function message(m){status.textContent=m;}
 function s(){return state.session}
 function task(){return s()?.tasks?.[s().position]}
 function draft(){const ss=s();if(!ss)return null;ss.drafts??={};const key=String(ss.position);return ss.drafts[key]??(ss.drafts[key]={value:'',explain:'',code:'',passedSeeds:[],lastTest:'',followValue:'',followExplain:'',self:'',error:'',initialOk:null,followOk:null,branch:null});}
 function clockMs(){const ss=s();if(!ss)return 0;return Math.max(0,Number(ss.elapsedMs)||0)+(ss.paused?0:Math.max(0,Date.now()-Number(ss.anchor||Date.now())))}
 const fmt=ms=>{const seconds=Math.floor(ms/1000);return `${String(Math.floor(seconds/3600)).padStart(2,'0')}:${String(Math.floor(seconds%3600/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;};
 function tick(){const x=document.getElementById('xClock');if(!x||!s())return;const ms=clockMs(),limit=s().duration*60000;x.textContent=fmt(ms)+' elapsed / '+s().duration+' min target'+(ms>limit?' · target exceeded':'');x.classList.toggle('late',ms>limit);}
 function stopWorker(){if(watchdog){clearTimeout(watchdog);watchdog=null;}if(worker){worker.terminate();worker=null;}}
 function setView(view){if(!['setup','session','report'].includes(view))return;if(view==='session'&&!s())view='setup';state.view=view;save();render();}
 function renderSetup(){
   const completed=state.sessions.length,finished=state.history.length;
   return `<p class="x-kicker">PHASE X / HIGH-FIDELITY INTERVIEW ARENA</p><h1>Practice under pressure.<br><em>Defend the decision.</em></h1>
   <p class="x-lead">Multiple rounds, original parameterized cases, answer-dependent follow-ups and real JavaScript test execution. No fake AI grading of unrestricted explanations and no invented employer interview reports.</p>
   <div class="x-metrics"><div><b>${completed}</b><span>Archived simulations</span></div><div><b>${finished}</b><span>Completed interview stages</span></div><div><b>4</b><span>Role-specific tracks</span></div></div>
   ${s()?`<section class="x-panel x-resume"><p class="x-kicker">UNFINISHED INTERVIEW</p><h2>Pick up your last session</h2><p>You are on stage ${s().position+1} of ${s().tasks.length} in the ${esc(core.TRACKS[s().track]?.label||s().track)} track. Your earlier work is saved locally.</p><div class="x-actions"><button type="button" class="x-primary" data-act="session">Continue interview →</button></div></section>`:' '}
   <section class="x-panel"><h2>Configure a mock interview</h2><p>Choose a role and a realistic session length. You can pause, resume after a reload, or export your records. All prompts are original practice, not purported historical questions.</p>
   <div class="x-grid"><label>Interview track<select id="xTrack">${Object.entries(core.TRACKS).map(([k,v])=>`<option value="${k}">${esc(v.label)}</option>`).join('')}</select></label>
   <label>Time budget<select id="xDuration"><option value="45">45 minutes · 3 stages</option><option value="90" selected>90 minutes · 5 stages</option><option value="120">120 minutes · 6 stages</option></select></label></div>
   <div class="x-actions"><button class="x-primary" type="button" data-act="start">Begin unfamiliar round</button><button type="button" data-act="report">Performance record</button></div></section>
   <section class="x-panel"><h2>How the interviewer responds</h2><ol><li><b>First response:</b> explain assumptions and commit to a numerical answer or implementation.</li><li><b>Adaptive probe:</b> correct performance triggers a harder transfer; a failure triggers a diagnostic repair question.</li><li><b>Debrief:</b> compare objective results with an instructor explanation, rate your communication manually and classify the mistake.</li><li><b>Next session:</b> prior objectively checked results influence quantitative difficulty. Ratings never substitute for verified test passes.</li></ol>
   <p class="x-small">The coding stage executes JavaScript in the existing disposable Web Worker; the linked C++20 Clang/WASM laboratory is separate. These browser-side checks are not secure hidden tests.</p></section>`;
 }
 function resultLabel(ok){return ok===true?'Correct':ok===false?'Not yet correct':'Not evaluated';}
 function renderSession(){
   const ss=s();if(!ss)return renderSetup();
   const t=task(),d=draft(),idx=ss.position,ratio=(idx/ss.tasks.length*100).toFixed(1),first=ss.stage==='initial',follow=ss.stage==='followup',debrief=ss.stage==='debrief';
   const followText=d.branch==='strong'?t.strong:t.repair,followExpected=d.branch==='strong'?t.strongAnswer:t.repairAnswer;
   return `<div class="x-topline"><span class="x-kicker">${esc(core.TRACKS[ss.track].label)} / ${esc(t.section)} / STAGE ${idx+1} OF ${ss.tasks.length}</span><span id="xClock" class="x-clock" role="timer" aria-live="off"></span></div>
   <div class="x-progress"><span style="width:${ratio}%"></span></div>
   <div class="x-actions"><button type="button" data-act="toggle-pause">${ss.paused?'Resume clock':'Pause clock'}</button><button type="button" data-act="end-early">End mock early</button><button type="button" data-act="report">Performance record</button></div>
   <article class="x-panel" aria-labelledby="xTaskTitle"><p class="x-kicker">ORIGINAL PRACTICE · ${t.kind==='code'?'EXECUTABLE CODE':'PARAMETERIZED NUMERICAL REASONING'} · ADAPTIVE LEVEL ${t.level}</p><h1 id="xTaskTitle">${esc(t.title)}</h1>
   <div class="x-stage"><span class="${first?'current':''}">1. First attempt</span><span class="${follow?'current':''}">2. Interviewer follow-up</span><span class="${debrief?'current':''}">3. Debrief</span></div>
   <p class="x-question">${esc(t.prompt)}</p>
   ${first?renderInitial(t,d):follow?renderFollow(t,d):renderDebrief(t,d,followText,followExpected)}
   </article>
   <p class="x-small">Source: original Mastery scenario; not a verified question from Jane Street, Citadel, HRT or another employer. Your reasoning is stored locally; explanations are not machine-graded.</p>`;
 }
 function renderInitial(t,d){
   if(t.kind==='code')return `<p><b>Implementation language:</b> JavaScript, checked by the existing source-visible Web Worker. For actual C++20 compilation, open <a href="interview-cpp.html#${esc(t.id)}" target="_blank" rel="noopener noreferrer">the corresponding C++20 defense lab</a>.</p>
   <label class="x-label" for="xCode">Write the required function</label><textarea id="xCode" class="x-code" rows="12" spellcheck="false">${esc(d.code||t.starter)}</textarea>
   <div class="x-actions"><button type="button" data-act="run-code" data-seed="0">Run test batch A</button><button type="button" data-act="run-code" data-seed="1">Run fresh batch B</button></div><pre id="xTestStatus" class="x-output" role="status">${esc(d.lastTest||'No tests executed for this implementation. Passing two distinct batches is needed for a code-pass marker.')}</pre>
   <label class="x-label" for="xExplain">Explain the invariant, edge cases and complexity (not automatically graded)</label><textarea id="xExplain" rows="5" placeholder="State an invariant and justify it...">${esc(d.explain)}</textarea>
   <div class="x-actions"><button type="button" class="x-primary" data-act="submit-initial">Submit implementation &amp; meet interviewer</button></div>`;
   return `<label class="x-label" for="xNumber">Your answer ${t.unit?'('+esc(t.unit)+')':''}</label><input id="xNumber" inputmode="decimal" autocomplete="off" placeholder="Number only" value="${esc(d.value)}">
   <p class="x-small">${esc(t.rounding)}</p><label class="x-label" for="xExplain">State assumptions and explain the approach</label>
   <textarea id="xExplain" rows="6" placeholder="What is the sample space, equation or invariant? What could go wrong?">${esc(d.explain)}</textarea>
   <div class="x-actions"><button type="button" class="x-primary" data-act="submit-initial">Commit first answer</button></div>`;
 }
 function answerUnit(t,branch){
   if(branch==='strong'){
     if(['payoff','cache','multiple'].includes(t.id))return '%';
     if(t.id==='throughput')return 'events/s';
     if(t.id==='stderr')return 'observations';
   }
   if(branch==='repair'&&t.id==='stderr')return 'factor';
   return t.unit;
 }
 function renderFollow(t,d){
   let input='';
   if(t.kind==='code'){
      const opts=d.branch==='strong'?t.strongOptions:t.repairOptions;
      input=`<fieldset class="x-choices"><legend>Select the strongest answer</legend>${opts.map((v,i)=>`<label><input type="radio" name="xFollowPick" value="${i}" ${String(d.followValue)===String(i)?'checked':''}> ${esc(v)}</label>`).join('')}</fieldset>`;
   }else{
      input=`<label class="x-label" for="xFollowNumber">Your follow-up answer ${answerUnit(t,d.branch)?'('+esc(answerUnit(t,d.branch))+')':''}</label><input id="xFollowNumber" inputmode="decimal" autocomplete="off" placeholder="Number only" value="${esc(d.followValue)}">`;
      if(t.id==='payoff'&&d.branch==='strong'||t.id==='cache'&&d.branch==='strong')input+='<p class="x-small">This follow-up asks for a percentage.</p>';
   }
   return `<p class="x-feedback">${d.initialOk?'Your first answer passed its objective checks. The interviewer changes the constraint.':'Your first answer did not meet the objective checks. The interviewer isolates the missing step.'}</p>
   <p class="x-kicker">${d.branch==='strong'?'TRANSFER / UNFAMILIAR VARIANT':'REPAIR / DIAGNOSTIC PROBE'}</p><p class="x-question">${esc(d.branch==='strong'?t.strong:t.repair)}</p>${input}
   <label class="x-label" for="xFollowExplain">Defend the change (human-reviewed)</label><textarea id="xFollowExplain" rows="5" placeholder="What assumption, state or invariant changed?">${esc(d.followExplain)}</textarea>
   <div class="x-actions"><button type="button" class="x-primary" data-act="submit-follow">Submit follow-up answer</button></div>`;
 }
 function renderDebrief(t,d,followText,followExpected){
   const initial=t.kind==='code'?(d.initialOk?'Passed two seeded batches':`Not verified on both batches`):`${esc(d.value)} (reference: ${esc(t.answer)} ${esc(t.unit)})`;
   const foll=t.kind==='code'?(d.branch==='strong'?t.strongOptions[t.strongAnswer]:t.repairOptions[t.repairAnswer]):`${esc(d.followValue)} (reference: ${esc(followExpected)} ${esc(answerUnit(t,d.branch))})`;
   return `<div class="x-results"><div><span>First attempt · objective</span><b>${resultLabel(d.initialOk)}</b></div><div><span>Interviewer probe · objective</span><b>${resultLabel(d.followOk)}</b></div></div>
   <h2>Instructor debrief</h2><p><b>First answer:</b> ${initial}</p><p><b>Follow-up:</b> ${esc(followText)}</p><p><b>Follow-up result:</b> ${foll}</p><p>${esc(t.kind==='code'?t.lesson:t.solution)}</p>
   <p class="x-small">These answer keys are disclosed only after you submit. This cannot certify the quality of your written or spoken explanation.</p>
   <div class="x-grid"><label>Self-review: explanation and clarity<select id="xSelf"><option value="">Choose an evidence-based rating</option>${[0,1,2,3,4].map(v=>`<option value="${v}" ${String(d.self)===String(v)?'selected':''}>${v}/4 · ${['Missing','Unclear','Partial','Clear','Precise and defensible'][v]}</option>`).join('')}</select></label>
   <label>Error category<select id="xError"><option value="">Choose a category</option>${['no error','concept gap','recognition','wrong representation','hidden assumption','arithmetic','edge case','coding implementation','time management','communication'].map(v=>`<option ${d.error===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label></div>
   <div class="x-actions"><button type="button" class="x-primary" data-act="complete-stage">${s().position+1===s().tasks.length?'Finish mock and review':'Record stage & continue'}</button></div>`;
 }
 function renderReport(){
   const h=state.history,verified=h.filter(x=>x.initialOk).length,avg=h.length?(h.reduce((a,x)=>a+(Number(x.self)||0),0)/h.length).toFixed(1):'—';
   const weak=Object.entries(h.reduce((o,v)=>{if(!o[v.id])o[v.id]={wrong:0,n:0};o[v.id].n++;if(!v.initialOk)o[v.id].wrong++;return o;},{})).sort((a,b)=>b[1].wrong-a[1].wrong).slice(0,6);
   return `<p class="x-kicker">PERFORMANCE LEDGER</p><h1>What held up under pressure?</h1><p class="x-lead">Machine-checked numeric and code outcomes are separate from human-reviewed reasoning. No hiring prediction or automatic explanation grading.</p>
   <div class="x-metrics"><div><b>${h.length}</b><span>Completed stages</span></div><div><b>${verified}/${h.length||0}</b><span>Objective first-attempt passes</span></div><div><b>${avg}/4</b><span>Self-rated explanation quality</span></div></div>
   <section class="x-panel"><h2>Diagnostic error ledger</h2>${weak.length?`<table class="x-table"><thead><tr><th>Archetype</th><th>Misses / attempts</th><th>Prescribed action</th></tr></thead><tbody>${weak.map(([id,v])=>`<tr><td>${esc(id)}</td><td>${v.wrong} / ${v.n}</td><td>${v.wrong?'Retry a fresh seed and explain the failed assumption':'Attempt a stronger transfer variant'}</td></tr>`).join('')}</tbody></table>`:'<p>No completed stages yet. Start a round and commit an answer.</p>'}</section>
   <section class="x-panel"><h2>Recent interview evidence</h2>${h.length?`<div class="x-ledger">${h.slice(-12).reverse().map(v=>`<div><b>${esc(v.title)}</b><small>${esc(v.track)} · ${esc(v.kind)} · ${esc(new Date(v.finishedAt).toLocaleDateString())}</small><span>First: ${resultLabel(v.initialOk)} · Probe: ${resultLabel(v.followOk)} · Explanation (self): ${v.self}/4${v.kind==='code'?' · batches: '+v.codePassed+'/2':''}</span></div>`).join('')}</div>`:'<p>Results will appear after the first completed stage.</p>'}</section>
   <div class="x-actions"><button type="button" data-act="setup" class="x-primary">New interview</button>${s()?'<button type="button" data-act="session">Resume interview</button>':''}</div>`;
 }
 function render(){
   if(!core||!root)return;
   root.innerHTML=state.view==='session'&&s()?renderSession():state.view==='report'?renderReport():renderSetup();
   document.querySelectorAll('[data-nav]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.nav===state.view)));
   tick();
 }
 function start(){
   const track=document.getElementById('xTrack')?.value,duration=Number(document.getElementById('xDuration')?.value);
   if(s()&&!confirm('Replace the unfinished interview with a new session?'))return;
   state.run++;const tasks=core.plan(track,duration,state.run,state.history);
   state.session={track,duration,tasks,position:0,stage:'initial',drafts:{},paused:false,elapsedMs:0,anchor:Date.now(),startedAt:new Date().toISOString(),run:state.run};
   state.view='session';save();render();message('Interview started. Keep an eye on the clock and state your reasoning aloud.');
 }
 function submitInitial(){
   const t=task(),d=draft();if(!t)return;
   if(d.explain.trim().length<15){message('Write at least one meaningful sentence explaining your reasoning before committing.');return;}
   if(t.kind==='code'){if(!d.lastTest){message('Run at least one real test batch before submitting your implementation.');return;}d.initialOk=d.passedSeeds?.length===2;}
   else{const result=core.gradeNumber(d.value,t.answer);if(!result.valid){message(result.why);return;}d.initialOk=result.ok;}
   d.branch=d.initialOk?'strong':'repair';s().stage='followup';save();render();message('The interviewer has selected the next probe from your actual result.');
 }
 function submitFollow(){
   const t=task(),d=draft(),expected=d.branch==='strong'?t.strongAnswer:t.repairAnswer;
   if(t.kind==='code'){if(!/^[012]$/.test(String(d.followValue))){message('Select one of the three answers.');return;}d.followOk=Number(d.followValue)===expected;}
   else{const result=core.gradeNumber(d.followValue,expected);if(!result.valid){message(result.why);return;}d.followOk=result.ok;}
   if(d.followExplain.trim().length<15){message('Explain the assumption or reasoning change in at least one meaningful sentence.');return;}
   s().stage='debrief';save();render();message('Both answers submitted. Review the verified results and the instructor notes.');
 }
 function completeStage(){
   const ss=s(),t=task(),d=draft();
   if(d.self===''||!Number.isInteger(Number(d.self))||Number(d.self)<0||Number(d.self)>4){message('Rate your explanation quality with a 0–4 self-review before moving forward.');return;}
   if(!d.error){message('Choose an error category (including “no error” when appropriate).');return;}
   const result={id:t.id,title:t.title,kind:t.kind,track:ss.track,level:t.level,section:t.section,initialOk:!!d.initialOk,followOk:!!d.followOk,codePassed:t.kind==='code'?d.passedSeeds.length:null,self:Number(d.self),error:d.error,assisted:false,finishedAt:new Date().toISOString(),elapsedMs:clockMs()};
   state.history.push(result);state.history=state.history.slice(-300);
   if(ss.position+1<ss.tasks.length){ss.position++;ss.stage='initial';save();render();message('Stage saved. New problem unlocked without revealing its answer.');return;}
   state.sessions.push({track:ss.track,duration:ss.duration,run:ss.run,startedAt:ss.startedAt,finishedAt:new Date().toISOString(),completed:ss.tasks.length,elapsedMs:clockMs()});state.sessions=state.sessions.slice(-60);
   state.session=null;state.view='report';save();render();message('Simulation completed. Review the objective record and target the repeated errors.');
 }
 function togglePause(){if(!s())return;const ss=s();if(ss.paused){ss.paused=false;ss.anchor=Date.now();}else{ss.elapsedMs=clockMs();ss.paused=true;ss.anchor=null;}save();render();}
 function endEarly(){if(!s()||!confirm('End this mock? Completed stages remain in the ledger; unfinished work will be discarded.'))return;stopWorker();state.sessions.push({track:s().track,duration:s().duration,run:s().run,startedAt:s().startedAt,finishedAt:new Date().toISOString(),completed:s().position,elapsedMs:clockMs(),endedEarly:true});state.session=null;state.view='report';save();render();message('Ended early. Completed stages remain recorded.');}
 function codeTest(seedIndex){
   const t=task(),d=draft();if(!t||t.kind!=='code'||worker)return;
   const seed=t.seed+(Number(seedIndex)?137:0),code=d.code||t.starter;
   d.code=code;if(code.length>60000){message('Code exceeds the 60 KB limit.');return;}
   let finished=false;
   try{worker=new Worker('readiness-worker.js')}catch(e){message('Web Worker unavailable: '+String(e.message||e));return;}
   const out=document.getElementById('xTestStatus');out.textContent='Running seeded test batch '+(Number(seedIndex)?'B':'A')+'…';
   function done(content,passed){if(finished)return;finished=true;stopWorker();d.lastTest=content;if(passed){if(!d.passedSeeds.includes(seed))d.passedSeeds.push(seed);}else d.passedSeeds=d.passedSeeds.filter(x=>x!==seed);save();const el=document.getElementById('xTestStatus');if(el)el.textContent=content;}
   watchdog=setTimeout(()=>done('Worker exceeded 8 seconds. The test run was terminated.',false),8000);
   worker.onmessage=e=>{const x=e.data||{};if(x.type!=='result')return;if(d.code!==code){done('Source changed during test: result discarded. Rerun both batches.',false);return;}const ok=Number.isInteger(x.passed)&&x.passed===x.total&&x.total>=10&&!x.error;
     const failure=x.failures?.[0];const desc=`Batch ${Number(seedIndex)?'B':'A'} · seed ${seed}: ${x.passed||0}/${x.total||0} tests passed${x.error?' · '+x.error:''}${failure?'\nFirst failure: '+JSON.stringify(failure).slice(0,850):''}\nPassed batches for unchanged code: ${ok?[...new Set([...d.passedSeeds,seed])].length:d.passedSeeds.length}/2`;
     done(desc,ok);
   };
   worker.onerror=e=>done('Worker runtime error: '+String(e.message||'Unknown error'),false);
   try{worker.postMessage({type:'run',slug:t.id,code,seed});}catch(e){done('Unable to start test: '+String(e.message||e),false);}
 }
 function download(name,text){const u=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 function exportRecords(){save();download('mastery-phase10-interviews.json',JSON.stringify({format:state.format,exportedAt:new Date().toISOString(),data:state},null,2));message('Phase X local record downloaded.');}
 async function importRecords(file){
   if(!file)return;try{
    if(file.size>2e6)throw Error('Backup exceeds 2 MB');const obj=JSON.parse(await file.text());
    if(obj.format!==KEY||obj.data?.format!==KEY||!Array.isArray(obj.data.history)||!Array.isArray(obj.data.sessions))throw Error('Not a Phase X export');
    if(!confirm('Replace local Phase X history with this backup? The active timer will not be imported.'))return;
    state={...defaults(),run:Number.isSafeInteger(obj.data.run)?Math.max(0,obj.data.run):0,history:obj.data.history.filter(v=>v&&typeof v.id==='string'&&typeof v.initialOk==='boolean'&&typeof v.followOk==='boolean'&&Number.isInteger(v.self)&&v.self>=0&&v.self<=4).slice(-300),sessions:obj.data.sessions.filter(v=>v&&typeof v.track==='string'&&Number.isFinite(v.duration)).slice(-60),view:'report',session:null};stopWorker();save();render();message('Validated history restored; active sessions are intentionally excluded.');
   }catch(e){message('Import failed: '+String(e.message||e).slice(0,160));}
 }
 document.addEventListener('click',e=>{
   const el=e.target.closest('[data-act]');if(!el)return;
   const act=el.dataset.act;
   if(act==='start')start();else if(act==='submit-initial')submitInitial();else if(act==='submit-follow')submitFollow();
   else if(act==='complete-stage')completeStage();else if(act==='toggle-pause')togglePause();
   else if(act==='run-code')codeTest(el.dataset.seed);else if(act==='end-early')endEarly();
   else if(['setup','session','report'].includes(act))setView(act);
   else if(act==='export')exportRecords();
 });
 document.addEventListener('input',e=>{
   if(!s())return;
   const d=draft(),id=e.target.id,v=e.target.value;
   if(id==='xNumber')d.value=v.slice(0,120);
   if(id==='xExplain')d.explain=v.slice(0,12000);
   if(id==='xFollowNumber')d.followValue=v.slice(0,120);
   if(id==='xFollowExplain')d.followExplain=v.slice(0,12000);
   if(id==='xCode'){
     const prev=d.code||task().starter;d.code=v.slice(0,60000);
     if(prev!==d.code){d.passedSeeds=[];d.lastTest='';const z=document.getElementById('xTestStatus');if(z)z.textContent='Implementation changed. Prior test passes invalidated; rerun both batches.';}
   }
   save();
 });
 document.addEventListener('change',e=>{
   if(!s())return;const d=draft(),id=e.target.id;
   if(e.target.name==='xFollowPick')d.followValue=e.target.value;
   if(id==='xSelf')d.self=e.target.value;
   if(id==='xError')d.error=e.target.value;
   save();
 });
 document.getElementById('xExport').addEventListener('click',exportRecords);
 document.getElementById('xImport').addEventListener('change',e=>{const f=e.target.files?.[0];importRecords(f);e.target.value='';});
 if(!s()&&state.view==='session')state.view='setup';
 render();setInterval(tick,1000);
})();
