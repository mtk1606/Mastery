/* Mastery Pathways: intentional A-to-Z learning, never fabricated certification. */
(function(){
'use strict';
const core=window.MasteryRoadmap,root=document.getElementById('rpRoot'),toast=document.getElementById('rpToast');
if(!core||!core.validate())throw Error('Roadmap curriculum not loaded');
const key='mastery-roadmap-v1',labKey='mastery-python-lab-v1',foundationKey='mastery-foundation-v1',DAY=86400000;
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const empty=()=>({version:'v1',track:'quant',pace:'focused',selected:'C0',topics:{},notes:{},reviews:{},session:null});
function sanitize(v){
 const s=empty();if(!v||v.version!=='v1')return s;
 if(core.tracks[v.track])s.track=v.track;
 if(core.pace[v.pace])s.pace=v.pace;
 if(core.get(v.selected))s.selected=v.selected;
 if(v.topics&&typeof v.topics==='object')for(const [k,x] of Object.entries(v.topics).slice(0,300)){const a=k.split(':'),st=core.get(a[0]);if(st&&/^\d+$/.test(a[1])&&Number(a[1])<st.topics.length&&x===true)s.topics[k]=true;}
 if(v.notes&&typeof v.notes==='object')for(const [k,x] of Object.entries(v.notes).slice(0,90))if(core.get(k)&&typeof x==='string')s.notes[k]=x.slice(0,6000);
 if(v.reviews&&typeof v.reviews==='object')for(const [k,x] of Object.entries(v.reviews).slice(0,90))if(core.get(k)&&x&&Number.isSafeInteger(x.count)&&x.count>=1&&x.count<10000&&Number.isFinite(x.next)&&Number.isFinite(x.at))s.reviews[k]={count:x.count,next:x.next,at:x.at};
 const q=v.session;
 if(q&&core.get(q.stage)&&['paused','running','finished'].includes(q.status)&&Number.isFinite(q.remaining)&&q.remaining>=0&&q.remaining<=5400000&&Number.isFinite(q.endAt))
   s.session={stage:q.stage,pace:core.pace[q.pace]?q.pace:s.pace,status:q.status,remaining:q.remaining,endAt:q.endAt};
 return s;
}
let state=sanitize(read(key)),timerNotice=null;
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{notice('Storage unavailable; export progress to retain it.');}}
function notice(s){toast.textContent=s;clearTimeout(timerNotice);timerNotice=setTimeout(()=>toast.textContent='',5500);}
function progress(st){let n=0;st.topics.forEach((_,i)=>{if(state.topics[st.id+':'+i])n++;});return {n,total:st.topics.length,reviewed:n===st.topics.length&&!!state.reviews[st.id]};}
function due(st){return !!state.reviews[st.id]&&state.reviews[st.id].next<=Date.now();}
function passes(){const x=read(labKey);return x&&x.version==='v1'&&x.passes&&typeof x.passes==='object'?x.passes:{};}
function recommend(){
 const seq=core.forTrack(state.track),foundation=window.MasteryFoundation;
 const record=read(foundationKey)||{},checks=record.checks||{},exams=record.exams||{},python=passes();
 if(foundation?.modules){
  const neededLabs={C0:['sum_positive','clamp_score'],C1:['symbol_counts','running_totals'],C2:['longest_unique','binary_first'],C3:['rolling_vwap','gradient_step'],C4:['dedup_events','aggregate_trades']};
  const qualifies=id=>!!python[id]&&python[id].passed>=6&&python[id].passed===python[id].total;
  for(const module of foundation.modules){
   const delayed=module.chapters.find(c=>checks[c.id]?.passed&&checks[c.id]?.next<=Date.now());
   if(delayed)return {s:core.get(module.id),label:'DUE: RETRIEVE WITHOUT NOTES',studyHref:'foundation.html#'+module.id+'/'+delayed.id};
   const first=module.chapters.find(c=>checks[c.id]?.passed!==true);
   if(first)return {s:core.get(module.id),label:'NEXT FOUNDATION LESSON',studyHref:'foundation.html#'+module.id+'/'+first.id};
   if(exams[module.id]?.best!==4)return {s:core.get(module.id),label:'FOUR-SCENARIO STAGE EXIT',studyHref:'foundation.html#'+module.id+'/assessment'};
   const missing=neededLabs[module.id].find(id=>!qualifies(id));
   if(missing)return {s:core.get(module.id),label:'FOUNDATION: VERIFY PYTHON CODE',studyHref:'python-lab.html#'+missing};
  }
 }
 const delayed=seq.slice(5).find(due);if(delayed)return {s:delayed,label:'SPACED RECALL IS DUE'};
 const unreviewed=seq.slice(5).find(s=>!progress(s).reviewed);
 return unreviewed?{s:unreviewed,label:'NEXT SPECIALIZATION MISSION'}:{s:seq[10],label:'ALL STAGES SELF-REVIEWED · PRACTICE UNSEEN QUESTIONS'};
}
function stats(seq){
 const total=seq.reduce((a,s)=>a+s.topics.length,0),seen=seq.reduce((a,s)=>a+progress(s).n,0),reviewed=seq.filter(s=>progress(s).reviewed).length;
 const eligible=new Set(seq.map(s=>s.lab).filter(Boolean)),p=passes(),tested=[...eligible].filter(k=>p[k]?.passed>=6&&p[k]?.passed===p[k]?.total).length;
 const fr=read(foundationKey),checks=fr?.checks||{},exams=fr?.exams||{};
 const foundationChecks=Object.entries(checks).filter(([id,v])=>/^c[0-4]-/.test(id)&&v?.passed===true).length;
 const exitChecks=Object.entries(exams).filter(([id,v])=>/^C[0-4]$/.test(id)&&v?.best===4).length;
 return {total,seen,reviewed,tested,foundationChecks,exitChecks,due:seq.filter(due).length};
}
function timerInfo(){
 const p=core.pace[state.pace],s=state.session;
 if(!s||s.stage!==state.selected)return {status:'idle',remaining:p.minutes*60000};
 if(s.status==='running'){const v=Math.max(0,s.endAt-Date.now());if(v===0){s.status='finished';s.remaining=0;save();return {status:'finished',remaining:0};}return {status:'running',remaining:v};}
 return {status:s.status,remaining:s.remaining};
}
function clock(ms){const seconds=Math.ceil(ms/1000);return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');}
function link(r){const out=/^https?:\/\//.test(r.href);return `<div class="rp-source"><a href="${E(r.href)}"${out?' target="_blank" rel="noopener noreferrer"':''}>${E(r.label)} ↗</a><small>${E(r.kind)}</small></div>`;}
function render(){
 const tr=core.tracks[state.track],seq=core.forTrack(state.track);
 if(!seq.some(s=>s.id===state.selected))state.selected='C0';
 const st=core.get(state.selected),rec=recommend(),all=stats(seq),p=progress(st),t=timerInfo(),pace=core.pace[state.pace],lab=passes()[st.lab],idx=seq.indexOf(st);
 root.innerHTML=`<section class="rp-hero" aria-labelledby="rpHeroTitle">
  <div><div class="rp-overline">THE LEARNING PATH · FROM ZERO TO INTERVIEW DEFENSE</div><h1 id="rpHeroTitle">A clear path.<br><em>Real understanding.</em></h1>
  <p>Begin from first principles; advance quickly when you can explain, implement and defend the concepts. Your role determines the specialization, not the standard of evidence.</p></div>
  <aside><strong>Learn → build → defend → recall.</strong>Every stage specifies topics, readings, practice and exit expectations. Topic ticks are self-review only; no course blocks or artificial streaks.</aside></section>
 <section class="rp-choices" aria-labelledby="rpPathsTitle"><div class="rp-heading-row"><h2 id="rpPathsTitle">Choose your destination</h2><span>Switch anytime; shared foundations retain progress.</span></div>
 <div class="rp-track-grid" role="group" aria-label="Career paths">${Object.values(core.tracks).map(x=>`<button type="button" class="rp-track" data-track="${x.id}" aria-pressed="${x.id===tr.id}"><span class="rp-track-head"><span class="rp-track-letter">${x.letter}</span><span class="rp-track-flag">${x.id===tr.id?'CURRENT PATH':'OPTION '+x.letter}</span></span><strong>${E(x.name)}</strong><p>${E(x.sub)}</p></button>`).join('')}</div></section>
 <section class="rp-mission" aria-label="Recommended next mission"><div><div class="rp-overline">${rec.label}</div><h2>${E(rec.s.title)}</h2><p>${E(rec.s.summary)}</p>
 <div class="rp-actions"><button class="rp-button primary" type="button" data-select="${rec.s.id}">${due(rec.s)?'Review this stage':'Open next step'} →</button>
 <a class="rp-button" href="${E(rec.studyHref|| (rec.s.id.startsWith('C')?'foundation.html#'+rec.s.id:rec.s.lab?'python-lab.html#'+rec.s.lab:rec.s.resources[0].href))}">${rec.label==='FOUNDATION: VERIFY PYTHON CODE'?'Pass the real Python tests':rec.s.id.startsWith('C')?'Study the full Foundation seminar':rec.s.lab?'Practice in Python':'Open first learning source'}</a></div></div>
 <div class="rp-mission-side"><span class="rp-small">TOPICS SELF-REVIEWED</span><strong>${all.seen} / ${all.total}</strong>
 <div class="rp-meter"><span style="width:${Math.round(all.seen/all.total*100)}%"></span></div><span class="rp-small">${all.reviewed}/11 stage reviews · ${all.due} due</span>
 <span class="rp-small">${all.tested} Python patterns with recorded passes · ${all.foundationChecks}/29 Foundation chapter checks · ${all.exitChecks}/5 exit scenarios fully correct</span></div></section>
 <section class="rp-stat-row" aria-label="Progress evidence"><div class="rp-stat"><b>${all.reviewed}/11</b><span>Stages self-reviewed</span></div>
 <div class="rp-stat"><b>${all.tested}</b><span>Python patterns passed locally</span></div><div class="rp-stat"><b>${all.due}</b><span>Due for delayed recall</span></div></section>
 <section class="rp-workspace" aria-label="Curriculum and stage">
 <aside><div class="rp-syllabus" aria-labelledby="rpSyllabusTitle"><div class="rp-syllabus-head"><div class="rp-overline">YOUR ROUTE · ${E(tr.short)}</div><h2 id="rpSyllabusTitle">11 ordered stages</h2><p>Recommended order, no locked modules. Review the entire exit rubric at any time.</p></div>
 ${seq.map((s,i)=>{const z=progress(s);return `<button type="button" class="rp-step" data-select="${s.id}" ${s.id===st.id?'aria-current="step"':''}><span class="rp-step-num">${String(i).padStart(2,'0')}</span><span class="rp-step-body"><strong>${E(s.title)}</strong><small>${z.n}/${z.total} topics${s.tier==='Common foundation'?' · shared':''}</small></span><span class="rp-step-state">${due(s)?'DUE':z.reviewed?'REVIEWED':z.n?'IN PROGRESS':'OPEN'}</span></button>`;}).join('')}</div>
 <section class="rp-tools" style="margin-top:14px" aria-label="Study focus and backup"><label for="rpPace">Study block duration
 <select id="rpPace">${Object.entries(core.pace).map(([k,v])=>`<option value="${k}" ${k===state.pace?'selected':''}>${E(v.name)}</option>`).join('')}</select></label>
 <span id="rpTimer" class="rp-timer" role="timer">${clock(t.remaining)}</span><p id="rpTimerStatus" class="rp-small">${t.status==='running'?'Focus block running':t.status==='paused'?'Focus block paused':t.status==='finished'?'Time complete · review your learning':'Optional clock · no streak pressure'}</p>
 <div class="rp-timer-controls"><button type="button" data-timer="toggle">${t.status==='running'?'Pause':t.status==='paused'?'Resume':t.status==='finished'?'Restart focus block':'Start focus block'}</button><button type="button" data-timer="reset">Reset</button></div>
 <p class="rp-small">${pace.minutes}m plan: learn ${pace.learn} · code ${pace.code} · explain ${pace.explain} · recap ${pace.review}. Minutes are not proof of mastery.</p>
 <div class="rp-backup"><button class="rp-button" type="button" data-export>Export pathway</button><label class="rp-button" for="rpImport">Restore pathway</label><input id="rpImport" type="file" accept=".json,application/json"></div>
 </section></aside>
 <article class="rp-detail" aria-labelledby="rpStageTitle"><div class="rp-detail-inner"><header class="rp-detail-head">
 <div class="rp-overline">${E(st.tier)} · STAGE ${String(idx).padStart(2,'0')} / 10</div><h2 id="rpStageTitle">${E(st.title)}</h2><p>${E(st.summary)}</p>
 <div class="rp-review-row"><span class="rp-small">${p.n}/${p.total} topics self-reviewed · ${state.reviews[st.id]?'review count '+state.reviews[st.id].count:'stage review not yet recorded'}</span>${due(st)?'<strong class="rp-small">Spaced review due</strong>':''}</div></header>
 <hr class="rp-rule"><section aria-labelledby="rpTopicsTitle"><h3 id="rpTopicsTitle" class="rp-subhead">01 · Understand the concepts</h3><p class="rp-small">Check a topic only when you can explain it without viewing the answer. Undo checks as soon as you discover a gap.</p>
 <div class="rp-topic-list">${st.topics.map((text,i)=>`<label class="rp-topic"><input type="checkbox" data-topic="${st.id}:${i}" ${state.topics[st.id+':'+i]?'checked':''}><span>${E(text)}</span></label>`).join('')}</div></section>
 <hr class="rp-rule"><section aria-labelledby="rpSourcesTitle"><h3 class="rp-subhead" id="rpSourcesTitle">02 · Study material</h3><p class="rp-small">Linked existing lessons or open academic resources. An advanced module mapped here is not necessarily a full built-in lesson.</p>
 ${st.resources.map(link).join('')}</section>
 <hr class="rp-rule"><section aria-labelledby="rpRubricTitle"><h3 class="rp-subhead" id="rpRubricTitle">03 · Evidence-based exit rubric</h3>
 <div class="rp-exam">${[['EXPLAIN',st.exam.reason],['IMPLEMENT',st.exam.implement],['DEFEND',st.exam.defend],['TRANSFER',st.exam.transfer]].map(([label,desc])=>`<div class="rp-exam-card"><strong>${label}</strong><p>${E(desc)}</p></div>`).join('')}</div>
 <div class="rp-callout" style="margin-top:13px"><strong>Applied transfer</strong><p>${E(st.transfer)}</p></div>
 <div class="rp-review-row">${st.lab?`<a class="rp-button primary" href="python-lab.html#${E(st.lab)}">Execute Python practice →</a><small>${lab&&lab.total>=6&&lab.passed===lab.total?'Passing run recorded in this browser.':'No passing executable record yet.'}</small>`:
 `<a class="rp-button primary" href="${E(st.resources[0].href)}">Open the relevant material →</a><small>Full objective in-browser certification is not available here yet.</small>`}</div></section>
 <hr class="rp-rule"><section aria-labelledby="rpNotesTitle"><h3 class="rp-subhead" id="rpNotesTitle">04 · Notes, mistakes and next questions</h3><label class="rp-small" for="rpNotes">What did you misunderstand? What would you explain differently to a real interviewer?</label>
 <textarea class="rp-notes" id="rpNotes" maxlength="6000" placeholder="Locally saved. Nothing is sent to a server.">${E(state.notes[st.id]||'')}</textarea>
 <div class="rp-review-row"><button type="button" class="rp-button" data-review="${st.id}" ${p.n!==p.total?'disabled':''}>${state.reviews[st.id]?'Record another self-review':'Record stage self-review'}</button>
 <small>${p.n!==p.total?'Review all the listed topics to enable this.':'Self-review schedules delayed recall. It is not a formal exam grade.'}</small></div></section>
 </div></article></section>`;
}
function choose(id){if(!core.forTrack(state.track).some(s=>s.id===id))return;state.selected=id;save();render();document.getElementById('rpStageTitle')?.scrollIntoView({block:'start',behavior:'instant'});}
function markReview(id){
 const st=core.get(id);if(!st||progress(st).n!==st.topics.length)return;
 const count=Math.min(9999,(state.reviews[id]?.count||0)+1),interval=[1,3,7,14,30,60][Math.min(count-1,5)];
 state.reviews[id]={count,next:Date.now()+interval*DAY,at:Date.now()};save();render();notice('Self-review saved. Revisit after '+interval+' day(s).');
}
function focusTimer(action){
 const s=state.session,p=core.pace[state.pace];
 if(action==='reset')state.session=null;
 else if(s?.status==='running'&&s.stage===state.selected){s.remaining=Math.max(0,s.endAt-Date.now());s.status='paused';}
 else if(s?.status==='paused'&&s.stage===state.selected){s.endAt=Date.now()+s.remaining;s.status='running';}
 else state.session={stage:state.selected,pace:state.pace,remaining:p.minutes*60000,endAt:Date.now()+p.minutes*60000,status:'running'};
 save();render();
}
function updateTimer(){const t=timerInfo(),el=document.getElementById('rpTimer'),msg=document.getElementById('rpTimerStatus');if(!el)return;el.textContent=clock(t.remaining);if(t.status==='finished'){if(msg)msg.textContent='Time complete · reflect on the material.';const b=document.querySelector('[data-timer="toggle"]');if(b)b.textContent='Restart focus block';}}
function exportState(){
 const url=URL.createObjectURL(new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'})),a=document.createElement('a');
 a.href=url;a.download='mastery-pathway-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);notice('Pathway exported. Python lab history is exported separately.');
}
async function importState(file){if(!file)return;try{if(file.size>2e6)throw Error('Backup exceeds 2 MB');const v=JSON.parse(await file.text());if(v.version!=='v1'||typeof v.topics!=='object')throw Error('Unrecognized pathway file');if(!confirm('Replace your current pathway notes and review record?'))return;state=sanitize(v);save();render();notice('Validated roadmap restored. Python lab results remain separate.');}catch(e){notice('Import rejected: '+String(e.message).slice(0,100))}}
root.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.track){state.track=b.dataset.track;state.selected='C0';save();render();return;}
 if(b.dataset.select){choose(b.dataset.select);return;}
 if(b.dataset.review){markReview(b.dataset.review);return;}
 if(b.dataset.timer){focusTimer(b.dataset.timer);return;}
 if(b.hasAttribute('data-export')){exportState();return;}
});
root.addEventListener('change',event=>{
 const el=event.target;
 if(el.id==='rpPace'&&core.pace[el.value]){state.pace=el.value;state.session=null;save();render();return;}
 if(el.dataset.topic){state.topics[el.dataset.topic]=el.checked;if(!el.checked)delete state.reviews[el.dataset.topic.split(':')[0]];save();render();document.querySelector('input[data-topic="'+el.dataset.topic+'"]')?.focus({preventScroll:true});return;}
 if(el.id==='rpImport'){importState(el.files?.[0]);el.value='';}
});
root.addEventListener('input',event=>{if(event.target.id==='rpNotes'){state.notes[state.selected]=event.target.value.slice(0,6000);save();}});
window.addEventListener('storage',event=>{if(event.key===labKey||event.key===key||event.key===foundationKey){if(event.key===key)state=sanitize(read(key));render();}});
window.addEventListener('pageshow',render);
setInterval(updateTimer,750);
render();
})();