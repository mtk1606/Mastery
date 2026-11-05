/* Mastery Interview Academy. Source-labelled practice; written reasoning is manually reviewed, not AI graded. */
'use strict';
const IA={byId:id=>document.getElementById(id),escape:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))};
const IA_KEY='mastery-interview-academy-v1';
const IA_DIMENSIONS=['Contract & clarification','Algorithm / correctness','Complexity & trade-offs','Tests & edge cases','Communication & follow-ups'];
const IA_QUESTIONS=MASTERY_INTERVIEW_QUESTIONS;
const IA_INDEX=new Map(IA_QUESTIONS.map(q=>[q.id,q]));
let iaState={selected:IA_QUESTIONS[0].id,drafts:{},history:[],session:null,roundNo:0};
try{const x=JSON.parse(localStorage.getItem(IA_KEY)||'null');if(x&&x.version===1&&x.data&&typeof x.data==='object'){
 const d=x.data;iaState={selected:IA_INDEX.has(d.selected)?d.selected:iaState.selected,drafts:d.drafts&&typeof d.drafts==='object'?d.drafts:{},history:Array.isArray(d.history)?d.history.slice(-250):[],session:d.session&&typeof d.session==='object'?d.session:null,roundNo:Number.isSafeInteger(d.roundNo)?d.roundNo:0};
 }}catch{}
const $=IA.byId,esc=IA.escape;
function iaSave(){try{localStorage.setItem(IA_KEY,JSON.stringify({version:1,data:iaState}));}catch{}}
function iaDraft(id){if(!iaState.drafts[id]||typeof iaState.drafts[id]!=='object')iaState.drafts[id]={notes:'',code:'',ratings:{},assisted:false};return iaState.drafts[id];}
function iaFilters(){return {company:$('iaCompany').value,role:$('iaRole').value,evidence:$('iaEvidence').value,query:$('iaSearch').value.toLowerCase().trim()};}
function iaFiltered(){const f=iaFilters();return IA_QUESTIONS.filter(q=>(f.company==='all'||q.company===f.company)&&(f.role==='all'||q.role===f.role)&&(f.evidence==='all'||q.evidence===f.evidence)&&(!f.query||[q.title,q.topic,q.company,q.role,...q.concepts].join(' ').toLowerCase().includes(f.query)));}
function iaEvidenceLabel(v){return v==='official'?'Official published example':v==='company-tags'?'Community company tag':'Original practice exercise';}
function iaQuestionList(){const list=iaFiltered();$('iaFilterCount').textContent=`${list.length} sourced questions match the filters.`; $('iaQuestionList').innerHTML=list.length?list.map(q=>`<button type="button" data-select="${esc(q.id)}" class="ia-question" aria-current="${String(iaState.selected===q.id)}"><b>${esc(q.title)}</b><small>${esc(q.company)} · ${esc(q.role)} · ${esc(q.difficulty)}</small><small>${iaEvidenceLabel(q.evidence)}</small></button>`).join(''):'<p class="ia-empty">No questions match these filters. Adjust the search or company.</p>';}
function iaCurrent(){return IA_INDEX.get(iaState.session?.ids?.[iaState.session.index]||iaState.selected)||IA_QUESTIONS[0];}
function iaClockMs(){const s=iaState.session;if(!s)return 0;return Math.max(0,Number(s.elapsedMs)||0)+(s.running?Math.max(0,Date.now()-Number(s.startedAt||Date.now())):0);}
function iaFmt(ms){const total=Math.floor(ms/1000),m=Math.floor(total/60),s=total%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function iaPause(){const s=iaState.session;if(s&&s.running){s.elapsedMs=iaClockMs();s.running=false;s.startedAt=null;iaSave();iaRender();}}
function iaResume(){const s=iaState.session;if(s&&!s.running){s.running=true;s.startedAt=Date.now();iaSave();iaRender();}}
function iaStart(ids){const good=ids.filter(id=>IA_INDEX.has(id));if(!good.length)return;
 iaState.session={ids:good,index:0,duration:Number($('iaDuration').value)||45,startedAt:Date.now(),elapsedMs:0,running:true,startedOn:new Date().toISOString(),results:[]};
 iaState.selected=good[0];iaState.roundNo++;iaSave();iaRender();$('iaReader').scrollIntoView({behavior:'smooth',block:'start'});
}
function iaStartCurated(){const matches=iaFiltered();if(!matches.length){$('iaStatus').textContent='No matching questions. Change filters.';return;}const k=iaState.roundNo%matches.length;
 const candidates=matches.length>2?[matches[k],matches[(k+1)%matches.length],matches[(k+2)%matches.length]]:matches;
 iaStart(candidates.map(q=>q.id));}
function iaSource(q){return `<div class="ia-source"><b>Evidence:</b> ${esc(iaEvidenceLabel(q.evidence))}. ${esc(q.evidenceText)}<br><b>Origin:</b> ${esc(q.source)}. <a href="${esc(q.link)}" target="_blank" rel="noopener noreferrer">Open source / full problem</a>${q.reference!==q.link?` · <a href="${esc(q.reference)}" target="_blank" rel="noopener noreferrer">Canonical exercise</a>`:''}.<br><small>Prompts and answer sketches on this website are independently worded educational adaptations. The links remain the authoritative full statements.</small></div>`;}
function iaRubric(q,id){const d=iaDraft(id);return `<div class="ia-rubric">${IA_DIMENSIONS.map((n,i)=>`<div class="ia-rubric-row"><label for="iaGrade${i}">${i+1}. ${esc(n)} <span class="ia-subtle">— ${esc(q.focus[i]||'Explain clearly')}</span></label><select id="iaGrade${i}" data-grade="${i}"><option value="">Not evaluated</option>${[0,1,2,3,4].map(v=>`<option value="${v}" ${Number(d.ratings?.[i])===v&&d.ratings?.[i]!==undefined?'selected':''}>${v} / 4 — ${['Missing','Weak','Developing','Strong','Excellent'][v]}</option>`).join('')}</select></div>`).join('')}</div><p class="ia-score-note">Manual evaluation only. A high self-score does not certify interview readiness. Rate the actual written code and reasoning, not confidence.</p>`;}
function iaRender(){iaQuestionList();const q=iaCurrent(),d=iaDraft(q.id),s=iaState.session;
 const inRound=Boolean(s&&s.ids.includes(q.id));
 const idx=inRound?s.index+1:0;
 $('iaReader').innerHTML=`<div class="ia-eyebrow">${inRound?`TIMED MOCK INTERVIEW · QUESTION ${idx} / ${s.ids.length}`:'QUESTION LIBRARY · INDEPENDENT PRACTICE'}</div>
 <h2>${esc(q.title)}</h2><div class="ia-prelude"><span>${esc(q.company)} · ${esc(q.role)}</span><span>${esc(q.topic)}</span><span>${esc(q.difficulty)} · recommended ${q.minutes} minutes</span><span class="ia-tag">${iaEvidenceLabel(q.evidence)}</span></div>
 ${inRound?`<div class="ia-interview-clock"><strong id="iaClock">${iaFmt(iaClockMs())}</strong><small>elapsed / ${s.duration} minutes target</small><button type="button" data-action="${s.running?'pause':'resume'}" class="ia-secondary">${s.running?'Pause':'Resume'}</button><button type="button" data-action="finish-round" class="ia-secondary">End round</button></div>`:''}
 <p class="ia-lead">${esc(q.prompt)}</p>${iaSource(q)}
 <section class="ia-section"><h3>Prerequisite reference</h3><p class="ia-subtle">Concepts are defined before you have to use them.</p><ul class="ia-facts">${q.concepts.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></section>
 <section class="ia-section"><h3>Clarify the problem</h3><p>Before coding, write assumptions, examples, the interface contract, and one counterexample to your first idea. Think out loud as if an interviewer were listening.</p>
 <label class="ia-text-caption" for="iaNotes">Your explanation, derivation, tests and reflections (auto-saved)</label><textarea id="iaNotes" class="ia-textarea" rows="9" placeholder="Clarifications → approach → invariant/proof → edge cases → complexity…">${esc(d.notes||'')}</textarea>
 <label class="ia-text-caption" for="iaCode">Your code / pseudocode (auto-saved). For executable C++, use the Mastery compiler link below.</label><textarea id="iaCode" class="ia-textarea ia-code" rows="12" spellcheck="false" placeholder="Write a complete implementation, not just the key loop…">${esc(d.code||'')}</textarea>
 <div class="ia-controls"><a class="ia-secondary" href="cpp-lab.html">Open the C++20 compiler lab</a><a class="ia-secondary" href="labs.html">Open JavaScript test labs</a>${!inRound?'<button type="button" data-action="start-single" class="ia-primary">Start a timed interview on this question</button>':''}</div></section>
 <section class="ia-section"><h3>Interviewer follow-ups</h3><p class="ia-subtle">Reveal follow-ups only when your first solution is complete.</p><details id="iaFollowups" class="ia-hint"><summary>Reveal progressive follow-up constraints</summary><ol class="ia-facts">${q.followups.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details></section>
 <section class="ia-section"><h3>Model reasoning &amp; limitations</h3><details id="iaReveal" class="ia-hint" ${d.assisted?'open':''}><summary>Reveal independent solution sketch (marks attempt as assisted)</summary><p>${esc(q.solution)}</p><p class="ia-subtle">Not a substitute for implementing the problem, running tests, and defending the solution.</p></details></section>
 <section class="ia-section"><h3>Structured interviewer evaluation</h3><p>Rate five competencies with evidence from your attempt. No AI-generated automatic score is claimed.</p>${iaRubric(q,q.id)}<div class="ia-controls"><button type="button" data-action="record-score" class="ia-primary">Record evaluation ${inRound?'& next question':''}</button><button type="button" data-action="clear-draft" class="ia-secondary">Clear this draft</button></div><p id="iaRecordStatus" role="status" aria-live="polite"></p></section>`;
 if(inRound)iaTickClock();iaProgress();
}
function iaTickClock(){const s=iaState.session,el=$('iaClock');if(!s||!el)return;const elapsed=iaClockMs();el.textContent=iaFmt(elapsed);el.style.color=elapsed>s.duration*60000?'var(--warn)':'var(--ia-ink)';}
function iaScore(){const q=iaCurrent(),d=iaDraft(q.id),ratings=IA_DIMENSIONS.map((_,i)=>d.ratings[i]);
 if(ratings.some(v=>!Number.isInteger(v)||v<0||v>4)){$('iaRecordStatus').textContent='Evaluate all five criteria before recording a completed attempt.';return;}
 const score=ratings.reduce((a,b)=>a+b,0),entry={question:q.id,company:q.company,role:q.role,topic:q.topic,grades:[...ratings],score,assisted:!!d.assisted,timestamp:new Date().toISOString(),elapsedMs:iaClockMs(),notesLength:(d.notes||'').length,codeLength:(d.code||'').length};
 iaState.history.push(entry);if(iaState.history.length>250)iaState.history.shift();
 if(iaState.session){iaState.session.results.push(entry);if(iaState.session.index+1<iaState.session.ids.length){iaState.session.index++;iaState.selected=iaState.session.ids[iaState.session.index];iaSave();iaRender();$('iaReader').scrollIntoView({block:'start'});return;}iaState.session=null;}
 iaSave();iaRender();$('iaStatus').textContent=`Recorded ${score}/20 self-assessment for ${q.title}. This is not an externally verified grade.`;
}
function iaProgress(){const h=iaState.history,unique=new Set(h.map(x=>x.question)),round=iaState.session;
 const avg=h.length?(h.reduce((s,x)=>s+x.score,0)/h.length).toFixed(1):'—';
 const topics=[...new Set(h.map(x=>x.topic))];
 const weak=IA_DIMENSIONS.map((s,i)=>({name:s,mean:h.length?h.reduce((a,b)=>a+b.grades[i],0)/h.length:0})).sort((a,b)=>a.mean-b.mean);
 $('iaProgress').innerHTML=`<div class="ia-progress-item"><div class="ia-subtle">Completed self-assessed attempts</div><div class="ia-progress-value">${h.length}</div><p>${unique.size} distinct questions · ${topics.length} topics practiced.</p></div>
 <div class="ia-progress-item"><div class="ia-subtle">Average manual score</div><div class="ia-progress-value">${avg}<small style="font:14px var(--sans)"> /20</small></div><p>Not a hiring probability or skill certification.</p></div>
 ${h.length?`<div class="ia-progress-item"><b>Review next</b><p>${esc(weak[0].name)} — average ${weak[0].mean.toFixed(1)}/4. Review a related lecture and retry an unseen variant.</p></div>`:''}
 ${round?`<div class="ia-progress-item"><b>Active session</b><p>Question ${round.index+1} of ${round.ids.length}. ${round.running?'Timer running':'Paused'}.</p></div>`:''}
 <div class="ia-progress-item"><b>Recommended study cycle</b><p>1. Explain the contract. 2. Solve without hints. 3. Test edge cases. 4. Prove the invariant. 5. Retry a new question later.</p></div>`;
}
function iaEnd(){const s=iaState.session;if(!s)return;const n=s.results.length;iaState.session=null;iaSave();iaRender();$('iaStatus').textContent=`Round ended. ${n} question(s) received complete manual evaluations.`;}
function iaExport(){iaSave();const blob=new Blob([JSON.stringify({format:'mastery-mock-interviews-v1',exportedAt:new Date().toISOString(),data:iaState},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='mastery-mock-interview-record.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);$('iaStatus').textContent='Interview record exported.';}
async function iaImport(ev){const f=ev.target.files?.[0];if(!f)return;try{if(f.size>2_000_000)throw Error('File too large.');const data=JSON.parse(await f.text());if(data.format!=='mastery-mock-interviews-v1'||!data.data||!Array.isArray(data.data.history)||!data.data.drafts||typeof data.data.drafts!=='object')throw Error('Invalid format');
 const d=data.data,history=d.history.filter(x=>IA_INDEX.has(x.question)&&Array.isArray(x.grades)&&x.grades.length===5&&x.grades.every(v=>Number.isInteger(v)&&v>=0&&v<=4)).slice(-250);
 const drafts={};for(const [id,v]of Object.entries(d.drafts)){if(!IA_INDEX.has(id)||!v||typeof v!=='object')continue;const ratings={};for(const i of [0,1,2,3,4])if(Number.isInteger(v.ratings?.[i])&&v.ratings[i]>=0&&v.ratings[i]<=4)ratings[i]=v.ratings[i];drafts[id]={notes:String(v.notes||'').slice(0,40000),code:String(v.code||'').slice(0,40000),ratings,assisted:!!v.assisted};}
 if(!confirm('Replace this browser’s interview record and drafts with the imported backup?'))return;
 iaState={selected:IA_INDEX.has(d.selected)?d.selected:IA_QUESTIONS[0].id,drafts,history,session:null,roundNo:Number.isSafeInteger(d.roundNo)?d.roundNo:0};iaSave();iaRender();$('iaStatus').textContent='Saved interview record restored. Active timers intentionally do not import.';
 }catch(e){$('iaStatus').textContent='Could not import: '+String(e.message||e).slice(0,120);}ev.target.value='';}
function iaInit(){const comps=[...new Set(IA_QUESTIONS.map(q=>q.company))].sort();$('iaCompany').innerHTML='<option value="all">All companies</option>'+comps.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');$('iaQuestionCount').textContent=`${IA_QUESTIONS.length} individually sourced questions · ${comps.length} target firms`;
 for(const id of ['iaCompany','iaRole','iaEvidence','iaSearch'])$(id).addEventListener(id==='iaSearch'?'input':'change',iaRender);
 $('iaDuration').addEventListener('change',iaSave);
 $('iaStartRound').addEventListener('click',iaStartCurated);
 $('iaQuestionList').addEventListener('click',e=>{const b=e.target.closest('[data-select]');if(!b)return;iaState.selected=b.dataset.select;if(iaState.session)iaEnd();iaSave();iaRender();});
 $('iaReader').addEventListener('input',e=>{const q=iaCurrent(),d=iaDraft(q.id);if(e.target.id==='iaNotes')d.notes=e.target.value.slice(0,40000);if(e.target.id==='iaCode')d.code=e.target.value.slice(0,40000);if(e.target.hasAttribute('data-grade')){const i=Number(e.target.dataset.grade);if(e.target.value==='')delete d.ratings[i];else d.ratings[i]=Number(e.target.value);}iaSave();});
 $('iaReader').addEventListener('toggle',e=>{if(e.target.id==='iaReveal'&&e.target.open){iaDraft(iaCurrent().id).assisted=true;iaSave();}},true);
 $('iaReader').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const act=b.dataset.action;if(act==='pause')iaPause();if(act==='resume')iaResume();if(act==='finish-round')iaEnd();if(act==='start-single')iaStart([iaCurrent().id]);if(act==='record-score')iaScore();if(act==='clear-draft'){if(confirm('Clear this question’s written work and rubric?')){delete iaState.drafts[iaCurrent().id];iaSave();iaRender();}}});
 $('iaExport').addEventListener('click',iaExport);$('iaImport').addEventListener('change',iaImport);
 // Timers are for learner pacing, not enforced locks or artificially graded passes.
 setInterval(()=>{if(iaState.session?.running)iaTickClock();},1000);
 iaRender();}
window.addEventListener('DOMContentLoaded',iaInit);