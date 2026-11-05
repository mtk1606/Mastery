/* Mastery XIII: teach, trace, test, transfer; separate objective and self-rated evidence. */
(function(){
'use strict';
const bank=window.MasteryFoundation,exams=window.MasteryFoundationExams,root=document.getElementById('fdRoot'),status=document.getElementById('fdStatus');
if(!bank?.validate()||!exams?.validate())throw Error('Invalid foundation curriculum');
const KEY='mastery-foundation-v1',DAY=86400000;
const E=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const blank=()=>({version:'v1',checks:{},exams:{},notes:{},transfers:{},help:{}});
function read(){
 let data=null;try{data=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
 const s=blank();if(!data||data.version!=='v1')return s;
 if(data.checks&&typeof data.checks==='object')for(const [id,v] of Object.entries(data.checks)){
  if(!bank.chapter(id)||!v||!Number.isFinite(v.at))continue;
  s.checks[id]={attempts:Math.max(0,Math.min(10000,Number(v.attempts)||0)),choice:Number.isInteger(v.choice)?v.choice:-1,passed:v.passed===true,assisted:v.assisted===true,at:v.at,next:Number(v.next)||0,reviews:Number(v.reviews)||0};
 }
 if(data.exams&&typeof data.exams==='object')for(const [id,v] of Object.entries(data.exams))if(exams.exams[id]&&v)
  s.exams[id]={best:Math.max(0,Math.min(4,Number(v.best)||0)),attempts:Number(v.attempts)||0,at:Number(v.at)||0,last:Array.isArray(v.last)&&v.last.length===4?v.last:null};
 for(const name of ['notes','transfers'])if(data[name]&&typeof data[name]==='object')for(const [id,v] of Object.entries(data[name]))if(bank.chapter(id)&&typeof v==='string')s[name][id]=v.slice(0,6000);
 if(data.help&&typeof data.help==='object')for(const [id,v] of Object.entries(data.help))if(bank.chapter(id)&&v===true)s.help[id]=true;
 return s;
}
let state=read(),stage='C0',chapter='c0-path',view='lesson',step=0,noticeTimeout=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{notify('Browser storage is unavailable; use your own notes.');}}
function notify(t){status.textContent=t;clearTimeout(noticeTimeout);noticeTimeout=setTimeout(()=>status.textContent='',5500);}
function route(){
 const a=decodeURIComponent(location.hash.replace(/^#/,'')).split('/');
 stage=bank.modules.some(m=>m.id===a[0])?a[0]:'C0';
 const m=bank.modules.find(x=>x.id===stage);
 view=a[1]==='assessment'?'assessment':'lesson';
 chapter=m.chapters.some(x=>x.id===a[1])?a[1]:m.chapters[0].id;
}
function go(st,id){const hash='#'+st+'/'+id;if(location.hash===hash){step=0;render();}else location.hash=hash;}
const passed=id=>state.checks[id]?.passed===true;
const due=id=>passed(id)&&state.checks[id].next<=Date.now();
const count=m=>m.chapters.filter(c=>passed(c.id)).length;
function sectionNav(m){
 return m.chapters.map((c,i)=>`<button class="fd-chapter" type="button" data-lesson="${c.id}" aria-current="${view==='lesson'&&chapter===c.id?'page':'false'}">
  <b>${String(i+1).padStart(2,'0')}</b><span>${E(c.title)}</span><small>${due(c.id)?'DUE':passed(c.id)?'✓':state.checks[c.id]?.attempts?'RETRY':'OPEN'}</small></button>`).join('');
}
function render(){
 route();const m=bank.modules.find(x=>x.id===stage),c=m.chapters.find(x=>x.id===chapter),total=bank.modules.reduce((n,x)=>n+x.chapters.length,0),done=bank.modules.reduce((n,x)=>n+count(x),0);
 root.innerHTML=`<section class="fd-hero"><div><div class="fd-eyebrow">THE SHARED A–Z FOUNDATIONS · C0–C4</div><h1>Learn the reason.<br><em>Then prove it.</em></h1>
 <p>29 original seminars. Discover a definition, predict the working trace, defeat a counterexample, solve a checkpoint and explain a new contract in your own words.</p></div>
 <div class="fd-stat"><strong>${done} / ${total}</strong><span>Short recognition checks passed. Formal proof and transfer are not automatically graded.</span></div></section>
 <nav class="fd-stage-nav" aria-label="Five foundation stages">${bank.modules.map(x=>`<button class="fd-stage-tab" type="button" data-stage="${x.id}" aria-pressed="${x.id===stage}">
 <span class="fd-num">${x.id}</span><strong>${E(x.title)}</strong><small>${count(x)}/${x.chapters.length} quick-checks</small></button>`).join('')}</nav>
 <div class="fd-path"><span class="fd-eyebrow">CURRENT MODULE</span><p>${E(m.lead)}</p><a class="fd-button" href="roadmap.html">Career roadmap →</a></div>
 <section class="fd-layout"><aside><div class="fd-aside"><div class="fd-aside-head"><span class="fd-eyebrow">${stage} / 5 COMMON STAGES</span>
 <h2>${E(m.title)}</h2><p>Lessons never lock. You can return to any concept whenever needed.</p></div>
 ${sectionNav(m)}<button class="fd-stage-exit" type="button" data-exam="${stage}">STAGE EXIT · four fresh scenarios → ${state.exams[stage]?.best===4?'✓':''}</button></div>
 <div class="fd-card" style="margin-top:15px;padding:18px"><div class="fd-eyebrow">SOURCE REFERENCES</div><div class="fd-sources">${m.source.map(([name,url])=>`<a href="${E(url)}" target="_blank" rel="noopener noreferrer">${E(name)} ↗</a>`).join('')}</div>
 <p class="fd-muted">Independent teaching; university links are context, not affiliation or certification.</p></div><div class="fd-card" style="margin-top:15px;padding:14px;display:flex;flex-wrap:wrap;gap:8px">
<button class="fd-button" type="button" id="fdExport">Export foundation progress</button>
<label class="fd-button" for="fdImport">Restore progress</label>
<input type="file" id="fdImport" accept=".json,application/json" aria-label="Restore Foundation Academy progress" style="width:100%;font-size:11px;max-width:100%">
</div></aside>
 <div class="fd-main">${view==='assessment'?renderExam(m):renderLesson(m,c)}</div></section>`;
}
function renderLesson(m,c){
 const i=m.chapters.indexOf(c),r=state.checks[c.id]||{},q=c.quiz;
 return `<article class="fd-card"><div class="fd-eyebrow">${m.id} · LESSON ${i+1} OF ${m.chapters.length}</div><h2 id="fdCurrentTitle">${E(c.title)}</h2><p class="fd-lead">${E(c.hook)}</p>
 <div class="fd-hint"><span class="fd-checkpoint">${r.passed?'QUICK-CHECK CORRECT':'CHECKPOINT OPEN'}</span><span>${r.attempts||0} attempt(s) ${r.assisted?'· assisted':''} ${due(c.id)?'· delayed review due':''}</span></div>
 <hr class="fd-rule"><section><div class="fd-label">01 · Definition and mechanism</div><h3>Understand what is happening</h3><p>${E(c.definition)}</p><p>${E(c.mechanism)}</p></section>
 <hr class="fd-rule"><section><div class="fd-label">02 · A worked example</div><h3>Follow each state transition</h3><div class="fd-example"><p>${E(c.example)}</p></div>
 <div class="fd-trace" aria-label="Interactive example trace"><span class="fd-step-meta" id="fdStepMeta">Step ${step+1} of ${c.trace.length}</span>
 <div class="fd-step-meter"><span id="fdStepMeter" style="width:${Math.round(100*(step+1)/c.trace.length)}%"></span></div>
 <div class="fd-step-body" id="fdStepBody">${E(c.trace[step])}</div>
 <div class="fd-actions"><button class="fd-button" type="button" data-trace="-1" ${step===0?'disabled':''}>← Previous</button><button class="fd-button" type="button" data-trace="1" ${step===c.trace.length-1?'disabled':''}>Next →</button></div></div></section>
 <hr class="fd-rule"><section><div class="fd-label">03 · Counterexample</div><h3>Why a tempting shortcut fails</h3><div class="fd-counter"><p>${E(c.trap)}</p></div></section>
 <hr class="fd-rule"><section><div class="fd-label">04 · Proof exercise</div><h3>Defend an invariant</h3><p>${E(c.proof)}</p><label for="fdProof" class="fd-muted">Record your own argument; this written answer is self-reviewed, never machine-graded.</label>
 <textarea id="fdProof" maxlength="6000" class="fd-editor" placeholder="My assumptions… The invariant… Initialization, preservation, termination…">${E(state.notes[c.id]||'')}</textarea></section></article>
 <section class="fd-card" id="fdCheckSection"><div class="fd-label">05 · Objective quick-check</div><h3>Make a closed-book commitment</h3><p>${E(q.prompt)}</p>
 <fieldset class="fd-form" style="border:0;padding:0;margin:0"><legend class="fd-muted" style="padding-bottom:10px">Choose one answer before revealing the explanation.</legend>
 ${q.options.map((x,n)=>`<label class="fd-choice"><input type="radio" name="fdQuiz" value="${n}" ${r.choice===n?'checked':''}><span>${E(x)}</span></label>`).join('')}</fieldset>
 <div class="fd-actions"><button class="fd-button primary" type="button" data-check="${c.id}">Check this answer →</button><span class="fd-muted">A corrected retry is useful learning, not an unseen certification.</span></div>
 ${r.attempts?`<div class="fd-explain"><strong>${r.choice===q.correct?'Correct for this scenario.':'Review the assumption.'}</strong><p>${E(q.explain)}</p><p>${r.assisted?'Assisted / after previous feedback.':''} ${r.passed?'At least one correct check recorded.':''}</p></div>`:''}</section>
 <section class="fd-card"><div class="fd-label">06 · Transfer problem</div><h3>What if the task changes?</h3><p>${E(c.transfer)}</p><label for="fdTransfer" class="fd-muted">Your own changed-contract explanation. There is no automated proof grader.</label>
 <textarea id="fdTransfer" maxlength="6000" class="fd-editor" placeholder="New requirement… Updated invariant… Counterexample…">${E(state.transfers[c.id]||'')}</textarea>
 <details class="fd-disclosure" data-guide="${c.id}"><summary>Show a reasoning guide (marks assisted study)</summary><p>${E(c.guide)}</p></details>
 <div class="fd-actions"><a class="fd-button primary" href="python-lab.html#${E(c.lab)}">Implement and test in Python →</a><span class="fd-muted">Executable test evidence is stored separately in the Python lab.</span></div></section>
 <div class="fd-card fd-next"><span class="fd-muted">Keep moving; revisit mistakes later.</span><button class="fd-button primary" type="button" data-next="${c.id}">${i===m.chapters.length-1?'Stage exit':'Next lesson'} →</button></div>`;
}
function renderExam(m){
 const prior=state.exams[m.id]||{},cases=exams.exams[m.id];
 return `<article class="fd-card"><div class="fd-eyebrow">${m.id} · STAGE EXIT ASSESSMENT</div><h2 id="fdCurrentTitle">New scenarios. Same reasoning.</h2>
 <p class="fd-lead">Attempt all four scenario checks without looking at a solution. These are different from the chapter questions. Each tests an assumption you should be able to explain under interview conditions.</p>
 <div class="fd-hint"><span class="fd-checkpoint">${prior.best===4?'ALL FOUR PREVIOUSLY CORRECT':'OBJECTIVE CHECK OPEN'}</span><span>Best ${prior.best||0}/4 · ${prior.attempts||0} attempts</span></div>
 <div class="fd-exam-grid" style="margin-top:20px">${cases.map((q,i)=>`<fieldset class="fd-exam-question"><legend class="fd-label">SCENARIO ${i+1} / 4</legend><h3>${E(q.prompt)}</h3>
 ${q.answers.map((answer,j)=>`<label class="fd-choice" style="margin:7px 0"><input type="radio" name="fdExam${i}" value="${j}" ${prior.last?.[i]===j?'checked':''}><span>${E(answer)}</span></label>`).join('')}
 ${prior.last?`<div class="fd-explain"><strong>${prior.last[i]===q.correct?'Correct':'Incorrect this attempt'}</strong><p>${E(q.why)}</p></div>`:''}</fieldset>`).join('')}</div>
 <div class="fd-actions"><button type="button" class="fd-button primary" data-grade="${m.id}">Submit the four scenarios →</button><span class="fd-muted">Retrying after feedback is assisted retrieval.</span></div>
 ${prior.last?`<div class="fd-exam-result"><strong>${prior.last.filter((v,i)=>v===cases[i].correct).length} / 4 most recent attempt</strong><p>${prior.best===4?'All four finite checks were answered correctly at least once.':'Reconstruct the explanation, then retry later.'} This is not proof of interview readiness; Python code and independent explanation are still needed.</p></div>`:''}
 <hr class="fd-rule"><div class="fd-label">EXIT STANDARD</div><p>Explain every chapter invariant, solve at least two independently tested Python tasks and defend a changed scenario without viewing the guide. Checkpoint scores and Python passes remain separate from ungraded proof writing.</p>
 <div class="fd-actions"><a href="python-lab.html" class="fd-button">Go to Python labs →</a><a href="roadmap.html" class="fd-button">Return to career roadmap →</a></div></article>`;
}
function evaluateCheck(id){
 const c=bank.chapter(id)?.chapter,pick=document.querySelector('input[name="fdQuiz"]:checked');
 if(!c||!pick){notify('Select one answer before submitting.');return;}
 const choice=Number(pick.value),old=state.checks[id]||{},attempts=(old.attempts||0)+1,ok=choice===c.quiz.correct;
 const reviews=(old.reviews||0)+(ok?1:0),days=reviews===1?1:reviews===2?3:reviews===3?7:14;
 state.checks[id]={passed:ok||old.passed===true,attempts,choice,assisted:state.help[id]===true||attempts>1||old.assisted===true,at:Date.now(),next:ok?Date.now()+Math.min(days,30)*DAY:old.next||0,reviews};
 save();render();document.getElementById('fdCheckSection')?.scrollIntoView({block:'start',behavior:'instant'});
 notify(ok?'Correct. Now explain why the alternative is wrong.':'Not yet. Review the reasoning, then try the changed task.');
}
function evaluateExam(id){
 const pool=exams.exams[id];if(!pool)return;
 const selected=pool.map((_,i)=>document.querySelector('input[name="fdExam'+i+'"]:checked'));
 if(selected.some(x=>!x)){notify('Answer all four scenarios before submitting.');return;}
 const choices=selected.map(x=>Number(x.value)),score=choices.filter((x,i)=>x===pool[i].correct).length,old=state.exams[id]||{};
 state.exams[id]={best:Math.max(old.best||0,score),attempts:(old.attempts||0)+1,at:Date.now(),last:choices};
 save();render();document.getElementById('fdCurrentTitle')?.scrollIntoView({block:'start',behavior:'instant'});
 notify('Stage objective score: '+score+'/4. Read the explanations and verify your reasoning.');
}
function exportProgress(){
 const data=JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2);
 const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');
 a.href=url;a.download='mastery-foundation-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
 notify('Foundation progress exported; roadmap and Python lab maintain independent records.');
}
async function importProgress(file){
 if(!file)return;try{
  if(file.size>2e6)throw Error('Backup too large');
  const data=JSON.parse(await file.text());
  if(data.version!=='v1'||!data.checks||typeof data.checks!=='object')throw Error('Unrecognized Foundation backup');
  if(!confirm('Replace your current Foundation checkpoint, notes and transfer answers?'))return;
  state=readFrom(data);save();render();notify('Foundation learning record restored.');
 }catch(e){notify('Import rejected: '+String(e.message).slice(0,105));}
}
function readFrom(x){
 const old=localStorage.getItem(KEY);
 try{localStorage.setItem(KEY,JSON.stringify(x));return read();}
 finally{if(old===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,old);}
}
root.addEventListener('click',event=>{
 const guide=event.target.closest('summary')?.parentElement;
 if(guide?.matches('details[data-guide]')&&!guide.open){state.help[guide.dataset.guide]=true;save();}
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.stage){go(b.dataset.stage,bank.modules.find(m=>m.id===b.dataset.stage).chapters[0].id);return;}
 if(b.dataset.lesson){go(stage,b.dataset.lesson);return;}
 if(b.dataset.exam){go(b.dataset.exam,'assessment');return;}
 if(b.dataset.trace){
  const c=bank.chapter(chapter).chapter;step=Math.max(0,Math.min(c.trace.length-1,step+Number(b.dataset.trace)));
  const body=document.getElementById('fdStepBody'),meter=document.getElementById('fdStepMeter'),meta=document.getElementById('fdStepMeta');
  if(body)body.textContent=c.trace[step];
  if(meter)meter.style.width=Math.round(100*(step+1)/c.trace.length)+'%';
  if(meta)meta.textContent='Step '+(step+1)+' of '+c.trace.length;
  document.querySelectorAll('[data-trace]').forEach(x=>x.disabled=x.dataset.trace==='1'?step===c.trace.length-1:step===0);
  return;
 }
 if(b.dataset.check){evaluateCheck(b.dataset.check);return;}
 if(b.dataset.grade){evaluateExam(b.dataset.grade);return;}
 if(b.dataset.next){
  const m=bank.modules.find(x=>x.id===stage),i=m.chapters.findIndex(x=>x.id===chapter);
  go(stage,i===m.chapters.length-1?'assessment':m.chapters[i+1].id);return;
 }
 if(b.id==='fdExport'){exportProgress();return;}
});
root.addEventListener('input',event=>{
 if(event.target.id==='fdProof'){state.notes[chapter]=event.target.value.slice(0,6000);save();}
 if(event.target.id==='fdTransfer'){state.transfers[chapter]=event.target.value.slice(0,6000);save();}
});
root.addEventListener('change',event=>{if(event.target.id==='fdImport'){importProgress(event.target.files?.[0]);event.target.value='';}});
root.addEventListener('toggle',event=>{if(event.target.matches?.('details[data-guide]')&&event.target.open){state.help[event.target.dataset.guide]=true;save();}},true);
window.addEventListener('hashchange',()=>{step=0;render();});
window.addEventListener('pageshow',render);
render();
})();
