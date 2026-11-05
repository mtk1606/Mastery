/* Phase VI course interface — no backend, no locks and no simulated user-code execution. */
'use strict';
const P6=id=>document.getElementById(id);
const p6safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P6_KEY='mastery-phase6-study-v1';
let p6memory={};try{const value=JSON.parse(localStorage.getItem(P6_KEY)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))p6memory=value;}catch{}
function p6save(){try{localStorage.setItem(P6_KEY,JSON.stringify(p6memory));}catch{}}
function p6record(id){return p6memory[id]||{draft:'',review:{},read:false};}
function p6update(id,patch){p6memory[id]={...p6record(id),...patch};p6save();}
const p6Wal={scenario:'after',index:0};
let p6Feed=new MASTERY_P6_MODEL.Feed(3),p6FeedLog=[];p6Feed.attach('fast');p6Feed.attach('slow');
let p6Timer={id:null,elapsed:0,started:0,handle:null};
function p6stoptimer(){if(p6Timer.handle){clearInterval(p6Timer.handle);p6Timer.handle=null;}if(p6Timer.started){p6Timer.elapsed+=Math.floor((Date.now()-p6Timer.started)/1000);p6Timer.started=0;}}
function p6clock(seconds){const m=Math.floor(seconds/60),s=seconds%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function p6route(){const found=location.hash.match(/^#\/(lecture|lab|case)\/([a-z-]+)$/);return found?{type:found[1],id:found[2]}:{type:'lecture',id:'commit'};}
function p6nav(){const current=p6route();
 const link=(kind,id,label,n)=>`<a href="#/${kind}/${id}" class="${current.type===kind&&current.id===id?'current':''}" ${current.type===kind&&current.id===id?'aria-current="page"':''}><span class="num">${p6safe(n)}</span>${p6safe(label)}</a>`;
 P6('p6LectureNav').innerHTML=PHASE6_LECTURES.map(x=>link('lecture',x.id,x.title,x.n)).join('');
 P6('p6LabNav').innerHTML=link('lab','wal','Crash and recovery model','I')+link('lab','feed','Subscriber retention','II');
 P6('p6CaseNav').innerHTML=PHASE6_CASES.map(x=>link('case',x.id,x.title,x.n)).join('');
}
function p6notes(id){const rec=p6record(id);return `<div class="p6-workshop"><h3>Field notes</h3><p class="p6-muted">Your reasoning stays in this browser until exported. These answers are not automatically graded.</p><textarea class="p6-response" id="p6Draft" placeholder="Derive the invariant, consider counterexamples, and defend each assumption…">${p6safe(rec.draft)}</textarea><div class="p6-controls"><button id="p6Mark" type="button">${rec.read?'Studied ✓':'Mark as studied'}</button><span class="p6-muted" id="p6Saved" aria-live="polite">Saved locally</span></div></div>`;}
function p6bindnotes(id){const draft=P6('p6Draft');if(draft)draft.addEventListener('input',()=>{p6update(id,{draft:draft.value.slice(0,20000)});P6('p6Saved').textContent='Draft saved';});const mark=P6('p6Mark');if(mark)mark.addEventListener('click',()=>{p6update(id,{read:!p6record(id).read});mark.textContent=p6record(id).read?'Studied ✓':'Mark as studied';});}
function p6lecture(ch){const id='lecture-'+ch.id;
 const bullets=items=>items.map(x=>`<li>${p6safe(x)}</li>`).join('');
 return `<div class="p6-kicker">LECTURE ${ch.n} / ${p6safe(ch.discipline)} · ${ch.minutes} MINUTE READING</div>
 <h2>${p6safe(ch.title)}</h2><p class="p6-deck">${p6safe(ch.thesis)}</p>
 <div class="p6-divider"></div><h3>Definitions before use</h3><div class="p6-terms">${ch.terms.map(x=>`<div class="p6-term"><strong>${p6safe(x[0])}</strong><p>${p6safe(x[1])}</p></div>`).join('')}</div>
 <h3>Model assumptions</h3><ol class="p6-conditions">${bullets(ch.assumptions)}</ol>
 <div class="p6-theorem"><strong>What we intend to establish</strong>${p6safe(ch.thesis)}</div>
 <h3>Derivation and correctness argument</h3><ol class="p6-steps">${bullets(ch.derivation)}</ol>
 <h3>Fully worked example</h3><p>${p6safe(ch.worked)}</p>
 <h3>A misleading shortcut</h3><p>${p6safe(ch.counter)}</p>
 <div class="p6-divider"></div><div class="p6-kicker">RECITATION / INDEPENDENT REASONING</div>
 <h3>Problem ${ch.n}</h3><p>${p6safe(ch.exercise)}</p><details class="p6-solution"><summary>Hint — reveal only when needed</summary><p>${p6safe(ch.hint)}</p></details>
 <details class="p6-solution"><summary>Model reasoning and resolution</summary><p>${p6safe(ch.solution)}</p></details>
 <h4>Review your reasoning</h4><ul class="p6-rubric">${bullets(ch.rubric)}</ul>
 ${p6notes(id)}<p class="p6-reading">Suggested primary reading: POSIX/Linux <a href="https://man7.org/linux/man-pages/man2/fsync.2.html" target="_blank" rel="noopener noreferrer">fsync(2)</a>, <a href="https://man7.org/linux/man-pages/man2/open.2.html" target="_blank" rel="noopener noreferrer">open(2)</a> and the included <a href="https://github.com/mtk1606/Mastery/tree/main/phase6" target="_blank" rel="noopener noreferrer">tested reference code</a>.</p>`;
}
function p6labWal(){
 const f=MASTERY_P6_MODEL.frames(p6Wal.scenario),s=f[Math.min(p6Wal.index,f.length-1)];
 const show=xs=>xs.length?xs.map(x=>`<li>${p6safe(x)}</li>`).join(''):'<li>None</li>';
 return `<p class="p6-kicker">PRACTICAL LABORATORY I / FAULT MODEL</p><h2>Crash cuts and durable prefixes</h2>
 <p class="p6-deck">Choose a deterministic fault scenario, then move through the lifecycle of one request. The diagram is a <strong>conceptual JavaScript model</strong>, not an execution trace of the C++ code or a real filesystem.</p>
 <div class="p6-controls"><label for="p6Scenario">Scenario</label><select id="p6Scenario">${Object.entries(MASTERY_P6_MODEL.SCENARIOS).map(([id,x])=>`<option value="${id}" ${id===p6Wal.scenario?'selected':''}>${p6safe(x.title)}</option>`).join('')}</select></div>
 <div class="p6-lab-overview"><span class="p6-kicker">STEP ${p6Wal.index} / ${f.length-1}</span><h3>${p6safe(s.step)}</h3><span class="p6-status">${p6safe(s.status)}</span><p class="p6-lab-desc">${p6safe(s.details)}</p></div>
 <div class="p6-frame-grid"><section class="p6-frame"><span class="cap">UNSYNCED / VOLATILE BUFFER</span><ul>${show(s.buffer)}</ul></section><section class="p6-frame"><span class="cap">DURABLE WAL PREFIX</span><ul>${show(s.wal)}</ul></section>
 <section class="p6-frame"><span class="cap">APPLIED IN-MEMORY TRANSITIONS</span><ul>${show(s.applied)}</ul></section><section class="p6-frame"><span class="cap">RECONSTRUCTED IDEMPOTENCY LEDGER</span><ul>${show(Object.entries(s.ledger).map(([k,v])=>`${k}: ${v}`))}</ul></section></div>
 <div class="p6-controls"><button type="button" id="p6Prev" ${p6Wal.index===0?'disabled':''}>← Previous</button><button class="primary" type="button" id="p6Next" ${p6Wal.index===f.length-1?'disabled':''}>Next →</button><button type="button" id="p6Reset">Restart</button></div>
 <div class="p6-theorem"><strong>Transfer question</strong>If the process dies after fsync but before acknowledgement, which fact is durable, and how does the client discover the outcome without sending a second order?</div>
 <details class="p6-solution"><summary>Model answer</summary><p>The command and its logical identity are in the durable WAL. The recovered process replays the record, rebuilds the idempotency ledger, and returns the original receipt when the client retries the same key and payload. An absent acknowledgement is ambiguous; it is not proof that the order never committed.</p></details>${p6notes('lab-wal')}`;
}
function p6labFeed(){const s=p6Feed.snapshot();const info=p6FeedLog.slice(-9).reverse().map(l=>`<li>${p6safe(l)}</li>`).join('');
 return `<div class="p6-kicker">PRACTICAL LABORATORY II / MARKET DATA</div><h2>One feed, independent readers</h2><p class="p6-deck">Publish events to a bounded retention window. Fast and slow clients advance independently; once a cursor falls behind the oldest retained event, the correct response is a resnapshot requirement, not silent partial replay.</p>
 <div class="p6-controls"><label for="p6Capacity">Retention capacity</label><select id="p6Capacity">${[2,3,4,5,8].map(n=>`<option ${n===s.capacity?'selected':''} value="${n}">${n} events</option>`).join('')}</select><button type="button" id="p6FeedReset">Reset</button></div>
 <div class="p6-lab-overview"><div class="p6-kicker">CURRENT RETENTION WINDOW</div><h3>Oldest ${s.oldest} · Latest ${s.latest}</h3><div class="p6-event-list">${s.events.length?s.events.map(x=>`<div class="p6-event">${x.seq}</div>`).join(''):'<span class="p6-muted">No published events</span>'}</div><p class="p6-muted">These are sequence numbers, not arbitrary trading-price observations.</p></div>
 <div class="p6-frame-grid"><section class="p6-frame"><span class="cap">FAST CLIENT</span><h3>Last consumed: ${s.cursors.fast}</h3><p class="p6-muted">Poll after each publish to stay near the head.</p><button type="button" id="p6Fast">Read next</button></section><section class="p6-frame"><span class="cap">SLOW CLIENT</span><h3>Last consumed: ${s.cursors.slow}</h3><p class="p6-muted">A slow reader may fall outside retention.</p><button type="button" id="p6Slow">Read next</button> <button type="button" id="p6Resnapshot">Resnapshot</button></section></div>
 <div class="p6-controls"><button class="primary" type="button" id="p6Publish">Publish next event →</button><button type="button" id="p6FastBurst">Publish 4; fast reads all</button></div>
 <div class="p6-lab-overview"><strong>Event and failure log</strong><ul class="p6-rubric" id="p6FeedHistory">${info||'<li>Publish events to begin.</li>'}</ul></div>
 <div class="p6-theorem"><strong>Prove the gap rule</strong>A client with last delivered sequence d must resnapshot when d+1 is smaller than the oldest retained sequence O. Equality means the missing-next event is still available.</div>${p6notes('lab-feed')}`;
}
function p6case(v){const id='case-'+v.id,r=p6record(id);let elapsed=(p6Timer.id===id?p6Timer.elapsed+(p6Timer.started?Math.floor((Date.now()-p6Timer.started)/1000):0):0);return `<div class="p6-kicker">DESIGN DEFENSE ${v.n} / ${v.minutes} MIN RECOMMENDED</div><h2>${p6safe(v.title)}</h2><p class="p6-deck">${p6safe(v.scenario)}</p>
 <div class="p6-controls"><strong class="p6-status-msg" id="p6Clock">${p6clock(elapsed)}</strong><button id="p6TimerStart" type="button">${p6Timer.started&&p6Timer.id===id?'Pause':'Start / resume'}</button><button id="p6TimerReset" type="button">Reset timer</button><span class="p6-muted">Time is informational; all materials remain unlocked.</span></div>
 <h3>Defense prompt</h3><p class="p6-case-question">${p6safe(v.task)}</p><h3>Submit your reasoning to yourself first</h3>
 <textarea id="p6Draft" class="p6-response" placeholder="State your API contract, failure model, invariants, and counterexamples…">${p6safe(r.draft)}</textarea><p class="p6-muted" id="p6Saved">Autosaved in this browser. Not automatically assessed.</p>
 <details class="p6-solution"><summary>Reveal instructor model answer</summary><p>${p6safe(v.model)}</p></details>
 <h3>Self-review rubric</h3><p class="p6-muted">Check only claims you actually supported in your response.</p>
 <div class="p6-worksheet">${v.criteria.map((criterion,i)=>`<label style="display:block;margin:12px 0;font-size:15px"><input type="checkbox" data-review="${i}" ${r.review?.[i]?'checked':''}> ${p6safe(criterion)}</label>`).join('')}</div>
 <div class="p6-theorem"><strong>Scope reminder</strong>The task uses fictional firms and scenarios. These are original practice questions, not a database of proprietary employer interview questions.</div>`;
}
function p6bindWal(){P6('p6Scenario').onchange=e=>{p6Wal.scenario=e.target.value;p6Wal.index=0;p6render();};P6('p6Prev').onclick=()=>{p6Wal.index=Math.max(0,p6Wal.index-1);p6render();};P6('p6Next').onclick=()=>{p6Wal.index=Math.min(MASTERY_P6_MODEL.frames(p6Wal.scenario).length-1,p6Wal.index+1);p6render();};P6('p6Reset').onclick=()=>{p6Wal.index=0;p6render();};}
function p6bindFeed(){P6('p6Capacity').onchange=e=>p6resetfeed(Number(e.target.value));P6('p6FeedReset').onclick=()=>p6resetfeed(p6Feed.capacity);
 P6('p6Publish').onclick=()=>{const n=p6Feed.publish('update '+(p6Feed.latest+1));p6FeedLog.push('Published sequence '+n);p6render();};
 for(const [id,client] of [['p6Fast','fast'],['p6Slow','slow']])P6(id).onclick=()=>{const r=p6Feed.poll(client);p6FeedLog.push(client+': '+r.status+(r.seq?' #'+r.seq:''));p6render();};
 P6('p6Resnapshot').onclick=()=>{const ok=p6Feed.resnapshot('slow');p6FeedLog.push('slow: '+(ok?'new authoritative snapshot at '+p6Feed.latest:'resnapshot rejected'));p6render();};
 P6('p6FastBurst').onclick=()=>{for(let i=0;i<4;i++){const n=p6Feed.publish('update '+(p6Feed.latest+1));p6FeedLog.push('Published sequence '+n);const r=p6Feed.poll('fast');p6FeedLog.push('fast: '+r.status+' #'+r.seq);}p6render();};
}
function p6resetfeed(cap){p6Feed=new MASTERY_P6_MODEL.Feed(cap);p6Feed.attach('fast');p6Feed.attach('slow');p6FeedLog=[];p6render();}
function p6bindCase(v){const id='case-'+v.id;if(p6Timer.id!==id){p6stoptimer();p6Timer={id,elapsed:0,started:0,handle:null};}
 P6('p6Draft').oninput=e=>{p6update(id,{draft:e.target.value.slice(0,20000)});P6('p6Saved').textContent='Saved locally';};
 document.querySelectorAll('[data-review]').forEach(e=>e.onchange=()=>{const review={...p6record(id).review,[e.dataset.review]:e.checked};p6update(id,{review});});
 P6('p6TimerStart').onclick=()=>{if(p6Timer.started){p6stoptimer();P6('p6TimerStart').textContent='Start / resume';}else{p6Timer.started=Date.now();P6('p6TimerStart').textContent='Pause';p6Timer.handle=setInterval(()=>{const el=P6('p6Clock');if(el&&p6Timer.id===id)el.textContent=p6clock(p6Timer.elapsed+Math.floor((Date.now()-p6Timer.started)/1000));},1000);}};
 P6('p6TimerReset').onclick=()=>{p6stoptimer();p6Timer.elapsed=0;P6('p6Clock').textContent='00:00';P6('p6TimerStart').textContent='Start / resume';};
}
function p6render(){const route=p6route();p6nav();const content=P6('p6Content');if(!content)return;
 const lecture=route.type==='lecture'?PHASE6_LECTURES.find(l=>l.id===route.id):null;
 const scenario=route.type==='case'?PHASE6_CASES.find(c=>c.id===route.id):null;
 if(lecture){content.innerHTML=p6lecture(lecture);p6bindnotes('lecture-'+lecture.id);}
 else if(route.type==='lab'&&route.id==='wal'){content.innerHTML=p6labWal();p6bindWal();p6bindnotes('lab-wal');}
 else if(route.type==='lab'&&route.id==='feed'){content.innerHTML=p6labFeed();p6bindFeed();p6bindnotes('lab-feed');}
 else if(scenario){content.innerHTML=p6case(scenario);p6bindCase(scenario);}
 else {location.hash='#/lecture/commit';return;}
}
function p6backup(){
 P6('p6Export').onclick=()=>{const payload={format:'mastery-phase6-v1',exportedAt:new Date().toISOString(),records:p6memory};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='mastery-phase6-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);P6('p6BackupStatus').textContent='Backup downloaded.';};
 P6('p6Import').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>350000)throw Error('Backup too large');const value=JSON.parse(await file.text());if(value.format!=='mastery-phase6-v1'||!value.records||typeof value.records!=='object'||Array.isArray(value.records))throw Error('Wrong backup format');const clean={};const keys=new Set([...PHASE6_LECTURES.map(l=>'lecture-'+l.id),...PHASE6_CASES.map(c=>'case-'+c.id),'lab-wal','lab-feed']);for(const [key,r] of Object.entries(value.records)){if(keys.has(key)&&r&&typeof r==='object'&&!Array.isArray(r)){const review={};if(r.review&&typeof r.review==='object')for(const [k,v] of Object.entries(r.review))if(/^\d+$/.test(k)&&k.length<=2)review[k]=!!v;clean[key]={draft:typeof r.draft==='string'?r.draft.slice(0,20000):'',read:!!r.read,review};}}if(!confirm('Replace all Phase VI notes and review marks in this browser?'))return;p6memory=clean;p6save();p6render();P6('p6BackupStatus').textContent='Backup restored.';}catch(err){P6('p6BackupStatus').textContent='Cannot restore: '+err.message;}finally{e.target.value='';}};
}
window.addEventListener('hashchange',()=>{p6stoptimer();p6Timer.id=null;p6render();window.scrollTo({top:0,behavior:'instant'});});
p6backup();p6render();