/* Mastery Phase V. University-style reading, reference experiments and timed self-review. */
'use strict';
const P5=$id=>document.getElementById($id);
const p5esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P5_KEY='mastery-reliability-phase5-v1';
const P5_DEFAULT=()=>({format:1,answers:{},rubrics:{},sessions:{}});
let p5memory=P5_DEFAULT();try{const x=JSON.parse(localStorage.getItem(P5_KEY)||'null');if(x?.format===1&&x.answers&&x.rubrics&&x.sessions)p5memory=x;}catch{}
const p5save=()=>{try{localStorage.setItem(P5_KEY,JSON.stringify(p5memory))}catch{}};
let p5route='',p5revealed='',p5scenario='normal',p5frames=[],p5step=0,p5fanout=null,p5feedLog=[],p5feedStatus='Ready';
const p5round=id=>PHASE5_COURSE.rounds.find(x=>x.id===id);
function p5routeValid(route){return PHASE5_COURSE.lectures.some(x=>route==='lecture:'+x.id)||['recovery','fanout'].includes(route)||PHASE5_COURSE.rounds.some(x=>route==='interview:'+x.id);}
function p5current(){let r=decodeURIComponent(location.hash.slice(1)||'lecture:routing');return p5routeValid(r)?r:'lecture:routing';}
function p5nav(){const groups=[['Formal lectures',PHASE5_COURSE.lectures.map(l=>['lecture:'+l.id,l.number+' · '+l.title])],['Interactive experiments',[['recovery','Checkpoint recovery and faults'],['fanout','Queue saturation & backpressure']]],['Mock interview rounds',PHASE5_COURSE.rounds.map(r=>['interview:'+r.id,r.title])]];
 P5('phase5Nav').innerHTML=groups.map(([title,items])=>`<div class="ms-nav-group"><p class="ms-nav-label">${p5esc(title)}</p>${items.map(([id,label])=>`<a href="#${id}" class="ms-nav-item ${id===p5route?'selected':''}" aria-current="${id===p5route?'page':'false'}">${p5esc(label)}</a>`).join('')}</div>`).join('');}
function p5SourceLinks(sources){return `<div class="p5-crossrefs"><strong>Study the reference implementation</strong><ul>${sources.map(s=>`<li><a target="_blank" rel="noopener noreferrer" href="https://github.com/mtk1606/Mastery/blob/main/${encodeURI(s)}"><code>${p5esc(s)}</code></a></li>`).join('')}</ul><p class="ms-help">These files are independently authored educational examples, not proprietary employer code.</p></div>`;}
function p5Lecture(id){const c=PHASE5_COURSE.lectures.find(x=>x.id===id);if(!c)return '';
 const key='lecture:'+id;
 return `<p class="overline">RELIABILITY ENGINEERING / LECTURE ${c.number} · ${c.minutes} MIN</p><h2>${p5esc(c.title)}</h2><p class="lead">${p5esc(c.question)}</p>
 <section><h3>Definitions before the theorem</h3><dl class="lexicon">${c.words.map(([t,meaning])=>`<div><dt>${p5esc(t)}</dt><dd>${p5esc(meaning)}</dd></div>`).join('')}</dl></section>
 <section><h3>The central correctness claim</h3><div class="ms-rule"><span class="ms-label">Invariant · Contract</span><p>${p5esc(c.principle)}</p></div><h4>Proof sketch</h4><ol>${c.proof.map(x=>`<li>${p5esc(x)}</li>`).join('')}</ol></section>
 <section><h3>A worked example</h3><p>${p5esc(c.worked)}</p><div class="p5-note"><strong>Where this reasoning fails if assumptions change</strong><p>${p5esc(c.pitfall)}</p></div></section>
 <section><h3>Recitation — solve before reading the model</h3><div class="p5-problem"><h4>The problem</h4><p>${p5esc(c.prompt)}</p><label class="ms-label" for="p5LectureDraft">Your reasoning, invariants and tests</label><textarea id="p5LectureDraft" data-p5-note="${p5esc(key)}" placeholder="Define the relevant state, derive a claim, test edge cases, then explain failure modes.">${p5esc(p5memory.answers[key]||'')}</textarea><div class="p5-controls"><button type="button" data-reveal="model:${id}">${p5revealed==='model:'+id?'Hide':'Reveal'} full worked solution</button></div>${p5revealed==='model:'+id?`<div class="ms-note"><span class="ms-label">Model reasoning · not an automated score</span><p>${p5esc(c.answer)}</p></div>`:''}</div></section>${p5SourceLinks(c.sources)}`;}
function p5Recovery(){return `<p class="overline">EXPERIMENT 01 · DETERMINISTIC RECOVERY</p><h2>Does the recovered state match?</h2><p class="lead">A real reference state machine routes two symbols, validates a snapshot at global sequence 5 and replays the remaining events. Change one failure condition and follow the exact state transitions.</p>
 <div class="ms-rule"><span class="ms-label">Correctness condition</span><p>If checkpoint S₅ is valid and ordered deltas 6…10 are unchanged, then restoring S₅ followed by 6…10 must produce the same final state as uninterrupted processing.</p></div>
 <div class="p5-controls"><label for="p5Scenario" class="ms-label">Select a fault</label><select id="p5Scenario"><option value="normal">Normal restore + old leader</option><option value="gap">Missing global event 7</option><option value="duplicate">Duplicate event 6</option><option value="corrupt">Corrupted checkpoint</option><option value="stale">Stale leader after promotion</option></select><button type="button" id="p5Build">Run scenario</button></div>
 <div class="p5-controls"><button id="p5Prev">← Previous</button><input id="p5Progress" aria-label="Replay position" type="range" min="0" max="0" value="0"><button id="p5Next">Next →</button><span id="p5FrameCount" class="p5-live-status"></span></div>
 <div class="p5-live"><div class="p5-label">Exact outcome</div><h3 id="p5FrameTitle">Ready</h3><p id="p5FrameMessage" role="status"></p><div id="p5Stats" class="p5-stats"></div><div id="p5Books" class="p5-grid"></div><p id="p5Hash" class="p5-live-status"></p></div>
 <details class="p5-hint"><summary>Inspect the validated checkpoint representation</summary><p class="ms-help">This is a noncryptographic checksum. A production implementation would also require durability and authorization guarantees.</p><pre id="p5SnapshotText" class="p5-code"></pre></details>
 <div class="p5-problem"><h4>Explain the failure mode</h4><p>For the scenario you selected, identify the last safe committed sequence, the first rejected operation and whether any matching state changed. What must the system request before it can resume?</p><textarea data-p5-note="recovery" placeholder="State the invariant, expected action, and proof of no partial state mutation.">${p5esc(p5memory.answers.recovery||'')}</textarea></div>
 <p class="ms-help">The browser model is separate from the C++ engine; native tests compare the golden 10-event replay fingerprint.</p>`;}
function p5FanoutPanel(){return `<p class="overline">EXPERIMENT 02 · BACKPRESSURE</p><h2>A slow subscriber cannot disappear.</h2><p class="lead">Publish updates to two bounded client queues. The reference refuses a publish if even one queue is full. No sequence advances on rejection, and nothing is silently dropped.</p>
 <div class="ms-rule"><span class="ms-label">Publication invariant</span><p>Publish(n+1) succeeds if, and only if, every subscriber queue has space. It appends the same n+1 to each queue and advances the publication cursor once. Otherwise all queues stay unchanged.</p></div>
 <div class="p5-controls"><label for="p5Capacity" class="ms-label">Queue capacity</label><select id="p5Capacity">${[1,2,3,4,8].map(n=>`<option value="${n}" ${n===2?'selected':''}>${n} messages</option>`).join('')}</select><button id="p5Reset">Reset queues</button></div>
 <div class="p5-controls"><button id="p5Publish" type="button">Publish next message</button><button id="p5DrainFast" type="button">Consume: fast</button><button id="p5DrainSlow" type="button">Consume: slow</button></div><p id="p5FeedStatus" class="p5-live-status" role="status"></p><p id="p5FeedSeq" class="ms-label"></p><div id="p5Queues" class="p5-queues"></div>
 <h3>Event log</h3><div id="p5FeedLog" class="p5-log" aria-live="polite"></div>
 <section><h3>Proof obligation</h3><p>Explain why an all-or-nothing queue can prove a contiguous output per subscriber, even when a subscriber is slow. Then propose a more scalable architecture and specify its resynchronization contract.</p><textarea class="notes" data-p5-note="fanout" placeholder="Quantify queue memory, overflow and tail effects.">${p5esc(p5memory.answers.fanout||'')}</textarea></section>`;}
function p5Session(id){const round=p5round(id);return p5memory.sessions[id]||{state:'idle',remainingMs:round.minutes*60000,deadline:0};}
const p5Clock=ms=>{const n=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');};
function p5Left(session){return session.state==='running'?Math.max(0,session.deadline-Date.now()):session.remainingMs;}
function p5Interview(id){const r=p5round(id),s=p5Session(id),left=p5Left(s),done=p5memory.rubrics[id]||[];
 return `<p class="overline">TECHNICAL INTERVIEW / ${p5esc(r.level)} · ${r.minutes} MIN</p><h2>${p5esc(r.title)}</h2><p class="lead">A public-style practice scenario, independently authored for Mastery. It is not claimed to be a leaked or verified proprietary question from any employer.</p>
 <div class="p5-timer"><div class="p5-clock" id="p5Clock" role="timer" aria-live="off">${p5Clock(left)}</div><div><div class="p5-label" id="p5SessionStatus">${p5esc(s.state.toUpperCase())} · time-boxed practice, optional</div><div class="p5-controls"><button type="button" data-p5-timer="start">${s.state==='idle'||s.state==='done'?'Start new round':'Restart round'}</button><button type="button" data-p5-timer="${s.state==='running'?'pause':'resume'}" ${s.state==='idle'||s.state==='done'?'disabled':''}>${s.state==='running'?'Pause':'Resume'}</button><button type="button" data-p5-timer="finish">Finish</button></div></div></div>
 <section><h3>Problem statement</h3><div class="p5-problem"><p>${p5esc(r.question)}</p><h4>Your response</h4><textarea data-p5-note="interview:${id}" placeholder="Write code or pseudocode, invariants, a complexity argument, then adversarial tests.">${p5esc(p5memory.answers['interview:'+id]||'')}</textarea></div></section>
 <section><h3>Follow-up questions</h3><ol>${r.prompts.map(p=>`<li>${p5esc(p)}</li>`).join('')}</ol></section>
 <section><h3>Evaluation rubric — self assessed</h3><p class="ms-help">Check each criterion only after supporting it in your answer. A checked box is a study record, not an automated or employer score.</p><div class="p5-rubric">${r.rubric.map((item,n)=>`<label><input data-p5-rubric="${p5esc(id)}" type="checkbox" value="${n}" ${done.includes(n)?'checked':''}><span>${p5esc(item)}</span></label>`).join('')}</div><p id="p5RubricStatus" class="ms-help">${done.length}/${r.rubric.length} criteria self reviewed</p></section>
 <section><details class="p5-hint"><summary>Reveal instructor's model reasoning</summary><p>${p5esc(r.solution)}</p></details></section>`;}
function p5Render(){p5route=p5current();p5revealed='';p5nav();
 if(p5route.startsWith('lecture:'))P5('phase5Main').innerHTML=p5Lecture(p5route.slice(8));
 else if(p5route==='recovery'){P5('phase5Main').innerHTML=p5Recovery();p5Build();}
 else if(p5route==='fanout'){P5('phase5Main').innerHTML=p5FanoutPanel();p5Reset();}
 else if(p5route.startsWith('interview:'))P5('phase5Main').innerHTML=p5Interview(p5route.slice(10));
 if(p5route.startsWith('interview:'))p5UpdateTimer();
 window.scrollTo({top:0,behavior:'instant'});
}
function p5BookHTML(b){return `<div class="p5-symbol"><h4>${p5esc(b.symbol)}</h4><p class="p5-label">Local seq ${b.seq} · ${b.trades} fills · ${b.active} resting orders</p><div class="p5-row"><strong>Bid</strong><strong>Ask</strong></div><div class="p5-row"><span>${b.bid?p5esc(b.bid.price)+' × '+b.bid.quantity:'—'}</span><span>${b.ask?p5esc(b.ask.price)+' × '+b.ask.quantity:'—'}</span></div><div class="p5-label">Resting queues (price → ID/remaining)</div>${[...b.bids.map(l=>`B ${l.price}: ${l.items.map(i=>i.id+'/'+i.qty).join(' → ')}`),...b.asks.map(l=>`S ${l.price}: ${l.items.map(i=>i.id+'/'+i.qty).join(' → ')}`)].map(s=>`<div class="p5-row"><span>${p5esc(s)}</span></div>`).join('')||'<p class="ms-help">Empty book</p>'}</div>`;}
function p5Draw(){const f=p5frames[p5step];if(!f)return;
 P5('p5FrameTitle').textContent=f.step;P5('p5FrameMessage').textContent=f.message;
 P5('p5FrameMessage').className=f.ok?'p5-good':'p5-error';
 P5('p5FrameCount').textContent=`Frame ${p5step+1} of ${p5frames.length}`;
 P5('p5Prev').disabled=p5step===0;P5('p5Next').disabled=p5step===p5frames.length-1;
 P5('p5Progress').max=Math.max(0,p5frames.length-1);P5('p5Progress').value=p5step;
 const s=f.snapshot;P5('p5Stats').innerHTML=[['Leader epoch',s.epoch],['Global sequence',s.seq],['Reference books',s.books.length]].map(([label,value])=>`<div><strong>${value}</strong><small>${label}</small></div>`).join('');
 P5('p5Books').innerHTML=s.books.map(p5BookHTML).join('');
 P5('p5Hash').textContent='FNV-1a regression fingerprint: '+s.hash+(p5scenario==='normal'&&s.epoch===1&&s.seq===10&&s.hash==='780225790431407597'?' · matches pinned native golden state':'');
}
function p5Build(){p5scenario=P5('p5Scenario').value;const data=MasteryReliabilitySim.replayScenario(p5scenario);p5frames=data.frames;p5step=0;P5('p5SnapshotText').textContent=data.checkpoint;p5Draw();}
function p5Reset(){p5fanout=new MasteryReliabilitySim.Fanout(Number(P5('p5Capacity').value));p5feedLog=[];p5feedStatus='All queues empty; next update is sequence 1.';p5DrawFanout();}
function p5DrawFanout(){if(!p5fanout)return;const s=p5fanout.snapshot();P5('p5FeedStatus').textContent=p5feedStatus;P5('p5FeedSeq').textContent=`Last published: ${s.seq} · capacity ${s.capacity} per subscriber`;
 P5('p5Queues').innerHTML=s.clients.map(c=>`<div class="p5-queue"><h4>${p5esc(c.id)} subscriber</h4><p class="ms-help">Last delivered ${c.last} · ${c.queue.length}/${s.capacity} pending</p><div class="p5-slots">${Array.from({length:s.capacity},(_,i)=>`<span class="p5-slot ${i<c.queue.length?'filled':''}">${i<c.queue.length?c.queue[i]:'·'}</span>`).join('')}</div></div>`).join('');
 P5('p5FeedLog').innerHTML=p5feedLog.length?p5feedLog.slice(-15).map(v=>`<div>${p5esc(v)}</div>`).join(''):'No events yet';}
function p5QueueAction(action){let message;
 if(action==='publish'){const seq=p5fanout.seq+1;const out=p5fanout.publish();message=out==='ACCEPTED'?`PUBLISH seq ${seq}: committed to both queues`:`PUBLISH seq ${seq}: BACKPRESSURE, no sequence advanced`;}
 else{const name=action==='fast'?'fast':'slow';const out=p5fanout.drain(name);message=out===null?`CONSUME ${name}: empty queue`:`CONSUME ${name}: received contiguous seq ${out}`;}
 p5feedLog.push(message);p5feedStatus=message;p5DrawFanout();}
function p5UpdateTimer(){if(!p5route.startsWith('interview:')||!P5('p5Clock'))return;
 const id=p5route.slice(10),s=p5Session(id),left=p5Left(s);
 if(s.state==='running'&&left===0){p5memory.sessions[id]={...s,state:'done',remainingMs:0,deadline:0};p5save();}
 P5('p5Clock').textContent=p5Clock(left);P5('p5SessionStatus').textContent=(left===0?'TIME ENDED':s.state.toUpperCase())+' · time-boxed practice, optional';}
function p5TimerAction(mode){const id=p5route.slice(10),r=p5round(id);if(!r)return;
 let s={...p5Session(id)};if(mode==='start')s={state:'running',remainingMs:r.minutes*60000,deadline:Date.now()+r.minutes*60000};
 if(mode==='pause'&&s.state==='running'){s.remainingMs=p5Left(s);s.deadline=0;s.state='paused';}
 if(mode==='resume'&&s.state==='paused'){s.deadline=Date.now()+s.remainingMs;s.state='running';}
 if(mode==='finish'){s.remainingMs=p5Left(s);s.deadline=0;s.state='done';}
 p5memory.sessions[id]=s;p5save();P5('phase5Main').innerHTML=p5Interview(id);p5UpdateTimer();}
function p5Download(filename,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function p5Export(){p5Download('mastery-phase5-study-record.json',JSON.stringify({...p5memory,exportedAt:new Date().toISOString()},null,2),'application/json');P5('backupMessage').textContent='Study record downloaded.';}
async function p5Import(input){const file=input.files?.[0];if(!file)return;try{if(file.size>3e6)throw Error('Backup too large');const data=JSON.parse(await file.text());
 if(data.format!==1||typeof data.answers!=='object'||!data.answers||Array.isArray(data.answers)||typeof data.rubrics!=='object'||!data.rubrics||typeof data.sessions!=='object'||!data.sessions)throw Error('Not a Phase V study record');
 if(!confirm('Replace your Phase V notes and timer history with this backup?'))return;
 const cleaned=P5_DEFAULT();for(const [k,v] of Object.entries(data.answers)){if(typeof k==='string'&&k.length<100&&typeof v==='string')cleaned.answers[k]=v.slice(0,30000);}
 for(const [k,v] of Object.entries(data.rubrics)){const rr=p5round(k);if(rr&&Array.isArray(v))cleaned.rubrics[k]=[...new Set(v.filter(n=>Number.isSafeInteger(n)&&n>=0&&n<rr.rubric.length))];}
 for(const [k,v] of Object.entries(data.sessions)){const rr=p5round(k);if(rr&&v&&['idle','running','paused','done'].includes(v.state)&&Number.isFinite(v.remainingMs)&&v.remainingMs>=0&&v.remainingMs<=rr.minutes*60000&&Number.isFinite(v.deadline))cleaned.sessions[k]={state:v.state,remainingMs:v.remainingMs,deadline:v.deadline};}
 p5memory=cleaned;p5save();p5Render();P5('backupMessage').textContent='Backup restored.';
 }catch(err){P5('backupMessage').textContent='Restore failed: '+err.message;}finally{input.value='';}}
window.addEventListener('hashchange',p5Render);
document.addEventListener('input',ev=>{const field=ev.target.closest('[data-p5-note]');if(field){const key=field.dataset.p5Note;p5memory.answers[key]=field.value.slice(0,30000);p5save();}});
document.addEventListener('change',ev=>{
 const t=ev.target;if(t.id==='p5Progress'){p5step=Number(t.value);p5Draw();}
 if(t.dataset.p5Rubric){const id=t.dataset.p5Rubric,index=Number(t.value);let entries=new Set(p5memory.rubrics[id]||[]);if(t.checked)entries.add(index);else entries.delete(index);p5memory.rubrics[id]=[...entries].sort((a,b)=>a-b);p5save();const rr=p5round(id);P5('p5RubricStatus').textContent=`${entries.size}/${rr.rubric.length} criteria self reviewed`;}
 if(t.id==='p5Import')p5Import(t);
});
document.addEventListener('click',ev=>{const target=ev.target.closest('button');if(!target)return;
 if(target.id==='p5Export'){p5Export();return;}
 if(target.dataset.reveal){p5revealed=p5revealed===target.dataset.reveal?'':target.dataset.reveal;P5('phase5Main').innerHTML=p5Lecture(p5route.slice(8));return;}
 if(target.id==='p5Build'){p5Build();return;}
 if(target.id==='p5Prev'){p5step=Math.max(0,p5step-1);p5Draw();return;}
 if(target.id==='p5Next'){p5step=Math.min(p5frames.length-1,p5step+1);p5Draw();return;}
 if(target.id==='p5Reset'){p5Reset();return;}
 if(target.id==='p5Publish'){p5QueueAction('publish');return;}
 if(target.id==='p5DrainFast'){p5QueueAction('fast');return;}
 if(target.id==='p5DrainSlow'){p5QueueAction('slow');return;}
 if(target.dataset.p5Timer){p5TimerAction(target.dataset.p5Timer);return;}
});
setInterval(p5UpdateTimer,1000);
p5Render();