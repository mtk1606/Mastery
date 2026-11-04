/* Mastery C++20 / Systems Laboratory — UI, editable source, Worker lifecycle, reference traces. */
'use strict';
const $=id=>document.getElementById(id);
const safe=(text)=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const KEY='mastery-cpp-wasm-v1';
let memory={};
try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))memory=raw;}catch{}
let index=0,step=0,compilerWorker=null,compilerReady=false,compilerStarting=false,activeRun=null,watchdog=null,serial=0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(memory))}catch{}}
function record(){const c=CPP_LESSONS[index];return memory[c.id]||{code:c.starter,notes:'',lastResults:[]}}
function setRecord(patch){const id=CPP_LESSONS[index].id;memory[id]={...record(),...patch};save()}
function navigate(id){const i=CPP_LESSONS.findIndex(c=>c.id===id);if(i<0)return;clearRun();index=i;step=0;location.hash='lab='+id;render();window.scrollTo({top:0,behavior:'instant'})}
function render(){
 const c=CPP_LESSONS[index],r=record();
 $('cppLessons').innerHTML=CPP_LESSONS.map(l=>`<button type="button" data-lesson="${safe(l.id)}" class="${l.id===c.id?'selected':''}" aria-current="${l.id===c.id?'true':'false'}"><span>LAB ${l.number} · ${safe(l.time)}</span>${safe(l.title)}</button>`).join('');
 $('cppLecture').innerHTML=`<div class="lecture-kicker">${safe(c.unit)} · LAB ${safe(c.number)}</div><h2 class="lecture-title">${safe(c.title)}</h2><p class="lecture-goal">${safe(c.objective)}</p>
 <div class="lecture-section"><h3>The task</h3><p>${safe(c.question)}</p><div class="theorem"><strong>Contract</strong><code>${safe(c.contract)}</code></div></div>
 <div class="lecture-section"><h3>Quick reference · new concepts</h3><div class="glossary">${c.glossary.map(([term,definition])=>`<div><b>${safe(term)}</b><p>${safe(definition)}</p></div>`).join('')}</div></div>
 <div class="lecture-section"><h3>Derive the algorithm</h3><ol>${c.strategy.map(p=>`<li>${safe(p)}</li>`).join('')}</ol></div>
 <div class="lecture-section theorem"><strong>Important boundary case</strong>${safe(c.edge)}</div>`;
 $('cppEditor').value=typeof r.code==='string'?r.code:c.starter;
 $('cppNotes').value=typeof r.notes==='string'?r.notes:'';
 $('functionSignature').textContent=c.contract;
 $('discussionPrompt').textContent=c.discussion;
 $('cppReference').textContent=c.reference;
 paintEditor();renderCases([]);$('cppConsole').textContent='No output yet.';
 setStatus('The compiler loads only when you choose Compile & run tests.');
 step=0;renderTrace();
}
function paintEditor(){const ed=$('cppEditor');$('editorLines').textContent=Array.from({length:ed.value.split('\n').length},(_,i)=>i+1).join('\n');$('editorLines').scrollTop=ed.scrollTop;}
function renderCases(states){const c=CPP_LESSONS[index];$('cppCases').innerHTML=c.tests.map(([name],i)=>{
 const status=states[i]||'PENDING';const cls=status==='PASS'?'pass':status==='FAIL'?'fail':'';
 return `<div class="testcase ${cls}"><span>${String(i+1).padStart(2,'0')} · ${safe(name)}</span><span>${safe(status)}</span></div>`
 }).join('')}
function setStatus(message,variant=''){$('compileStatus').textContent=message;$('compileStatus').className='compile-status '+variant;}
function stopWorker(reason){if(watchdog)clearTimeout(watchdog);watchdog=null;if(compilerWorker){compilerWorker.terminate();compilerWorker=null;}compilerReady=false;compilerStarting=false;activeRun=null;$('runCpp').disabled=false;if(reason)setStatus(reason,'bad')}
function clearRun(){if(activeRun||compilerStarting)stopWorker('Stopped. The next run starts with a fresh compiler worker.');}
function initWorker(){
 if(compilerWorker)return;
 try{
  compilerWorker=new Worker('cpp-wasm-worker.js');compilerStarting=true;
  compilerWorker.onmessage=receiveWorker;
  compilerWorker.onerror=ev=>{const msg=String(ev.message||'Worker failed');stopWorker('WebAssembly worker error: '+msg);$('cppConsole').textContent=msg;};
  watchdog=setTimeout(()=>stopWorker('Compiler initialization timed out. Check your internet connection and try again.'),125000);
  compilerWorker.postMessage({type:'init'});
 }catch(error){stopWorker('This browser does not support this compiler worker: '+error.message)}
}
function receiveWorker(event){const m=event.data||{};
 if(m.type==='status'){setStatus(m.message);return;}
 if(m.type==='ready'){
  compilerReady=true;compilerStarting=false;if(watchdog)clearTimeout(watchdog);watchdog=null;
  setStatus(m.message,'good');if(activeRun&&activeRun.queued)submit(activeRun);return;
 }
 if(m.type==='error'){
  const phase=m.phase==='initialization'?'Compiler installation':'Compilation / execution';
  const message=phase+': '+m.message+'\nIf the compiler assets are unavailable, use the native C++ test project from the repository.';
  $('cppConsole').textContent=message;stopWorker(message);return;
 }
 if(m.type==='result'){
  if(!activeRun||m.id!==activeRun.id)return;
  if(watchdog)clearTimeout(watchdog);watchdog=null;
  $('runCpp').disabled=false;const c=CPP_LESSONS[index];
  const hits=new Map();for(const match of String(m.stdout||'').matchAll(/^MASTERY_TEST\|(\d+)\|(PASS|FAIL)\s*$/gm))hits.set(Number(match[1]),match[2]);
  const statuses=c.tests.map((_,i)=>hits.get(i+1)||'NOT RUN');renderCases(statuses);
  const pass=statuses.filter(x=>x==='PASS').length;
  const msg=pass===c.tests.length?'All '+pass+' C++20 tests passed.':pass+' of '+c.tests.length+' C++ tests passed.';
  const diagnostic=(Array.isArray(m.errors)?m.errors.join('\n'):'');
  $('cppConsole').textContent=`${diagnostic?diagnostic+'\n\n':''}${m.stderr?m.stderr+'\n':''}${m.stdout||''}\n[exit ${m.exitCode===null?'compile/link failure':m.exitCode}] · elapsed ${m.elapsedMs}ms`;
  setStatus(m.exitCode===0&&pass===c.tests.length?msg:msg+' Review the compiler output and failing cases.',m.exitCode===0&&pass===c.tests.length?'good':'bad');
  setRecord({lastResults:statuses,lastRunAt:new Date().toISOString()});activeRun=null;
 }
}
function submit(request){if(!compilerWorker||!compilerReady)return;request.queued=false;if(watchdog)clearTimeout(watchdog);
 watchdog=setTimeout(()=>stopWorker('Compile/run exceeded 45 seconds. The worker was terminated; try simpler code or run the native suite.'),45000);
 compilerWorker.postMessage({type:'run',id:request.id,source:request.source});setStatus('Compiling with Clang 22 (C++20), then running the test harness…');}
function run(){if(activeRun)return;
 const c=CPP_LESSONS[index],code=$('cppEditor').value;
 if(!code.trim()){setStatus('Enter a C++ implementation before running.','bad');return;}
 if(code.length>32000){setStatus('Exercise source is limited to 32 KB.','bad');return;}
 const source=cppBuildSource(c,code);activeRun={id:++serial,source,queued:true};
 $('runCpp').disabled=true;renderCases([]);$('cppConsole').textContent='Preparing C++20 test harness…';
 if(!compilerWorker)initWorker();else if(compilerReady)submit(activeRun);
}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node}
function renderTrace(){
 const c=CPP_LESSONS[index],frames=CPP_REFERENCE_TRACES[c.id],f=frames[step],target=$('traceStage');target.replaceChildren();
 target.append(el('h3','',f.title),el('p','',f.detail));
 if(f.kind==='hash'){
  const wrap=el('div','trace-hash');f.items.forEach((v,i)=>{const node=el('div','trace-cell'+(i===f.i?' active':''));node.append(el('b','',v),el('small','',i===f.i?'current index':'index '+i));wrap.append(node);});target.append(wrap,el('p','',`Seen map: ${f.seen.map(x=>x.join(' → ')).join(', ')||'empty'}${f.answer?' · Result '+f.answer:''}`));
 }else if(f.kind==='list'){
  const wrap=el('div','trace-list');const nums=[12,27,41];nums.forEach((value,i)=>{const node=el('div','trace-node'+(f.curr===i?' active':''));node.append(el('b','',value),el('small','',`node ${i} · next→${f.links[i]<0?'null':nums[f.links[i]]}`));wrap.append(node);if(i<2)wrap.append(el('span','trace-arrow','·'));});target.append(wrap,el('p','',`prev: ${f.prev<0?'nullptr':nums[f.prev]} · curr: ${f.curr<0?'nullptr':nums[f.curr]} · saved next: ${f.next<0?'nullptr':nums[f.next]}`));
 }else if(f.kind==='ring'){
  const wrap=el('div','trace-ring');f.slots.forEach((value,i)=>{const node=el('div','trace-cell'+(i===f.head||i===f.tail?' active':''));node.append(el('b','',value===null?'—':value),el('small','',`slot ${i}`));wrap.append(node)});target.append(wrap,el('p','',`head = ${f.head}, tail = ${f.tail}, count = ${f.count}, capacity = ${f.slots.length}`));
 }else if(f.kind==='book'){
  const wrap=el('div','trace-book');for(const [label,side] of [['Bids (highest first)',f.bids],['Asks (lowest first)',f.asks]]){const column=el('div','book-side');column.append(el('h4','',label));side.forEach(([price,orders])=>{const row=el('div','price-level');row.append(el('strong','',price),el('span','',orders.join(' → ')));column.append(row)});if(!side.length)column.append(el('p','quiet','No resting orders'));wrap.append(column)}const lines=el('div','trade-lines',f.fills.length?'Fills: '+f.fills.join(' · '):'Fills: none');wrap.append(lines);target.append(wrap);
 }
 $('traceCounter').textContent=(step+1)+' / '+frames.length;$('tracePrev').disabled=step===0;$('traceNext').disabled=step===frames.length-1;
}
function downloadFile(name,content,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function exportProgress(){downloadFile('mastery-cpp20-labs-progress.json',JSON.stringify({format:'mastery-cpp20-v1',savedAt:new Date().toISOString(),lessons:memory},null,2),'application/json')}
function restoreProgress(file){if(!file)return;file.text().then(text=>{const obj=JSON.parse(text);if(obj.format!=='mastery-cpp20-v1'||!obj.lessons||Array.isArray(obj.lessons))throw Error('Incorrect backup format');if(!confirm('Replace existing C++ lab drafts and notes with the selected backup?'))return;const next={};for(const l of CPP_LESSONS){const r=obj.lessons[l.id];if(r&&typeof r==='object')next[l.id]={code:String(r.code||l.starter).slice(0,32000),notes:String(r.notes||'').slice(0,20000)};}memory=next;save();render();setStatus('C++20 code and study notes restored from backup.','good')}).catch(error=>setStatus('Could not restore backup: '+String(error.message||error),'bad'))}
function quantile(arr,p){const sorted=arr.slice().sort((a,b)=>a-b),i=Math.min(sorted.length-1,Math.max(0,Math.ceil(p*sorted.length)-1));return sorted[i]||0}
function benchmark(){const selected=Math.max(1000,Math.min(50000,Number($('benchEvents').value)||1000));const chunks=40,perChunk=Math.ceil(selected/chunks),samples=[];let state=0x12345,executed=0,checksum=0,book=[];
 const next=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state};
 for(let batch=0;batch<chunks&&executed<selected;batch++){
  const start=performance.now(),count=Math.min(perChunk,selected-executed);
  for(let i=0;i<count;i++){
   const r=next(),price=96+(r%9),qty=1+((r>>>8)%5),buy=(r&1)===0;
   if((r%11)===0 && book.length){const j=r%book.length;checksum+=book[j].price*book[j].qty;book.splice(j,1)}
   else {const match=book.findIndex(x=>x.buy!==buy && (buy?x.price<=price:x.price>=price));if(match>=0){const rest=book[match],fill=Math.min(rest.qty,qty);rest.qty-=fill;checksum+=fill*rest.price;if(rest.qty===0)book.splice(match,1);if(qty>fill)book.push({buy,price,qty:qty-fill});}else book.push({buy,price,qty});}
  }
  samples.push((performance.now()-start)*1000/count);executed+=count;
 }
 const mean=samples.reduce((a,b)=>a+b,0)/samples.length,med=quantile(samples,.5),p95=quantile(samples,.95),p99=quantile(samples,.99);
 const view=$('benchResults');view.replaceChildren();const row=el('div','metric-row');for(const [label,value] of [['p50',med],['p95',p95],['p99',p99],['Mean',mean]]){const item=el('div');item.append(el('b','',value.toFixed(2)+' µs'),el('small','',label+' / event'));row.append(item)}view.append(row,el('p','quiet',`Browser reference JavaScript only · ${executed.toLocaleString()} synthetic events · ${samples.length} batch measurements · checksum ${checksum} · remaining orders ${book.length}. Measurements are batch averages, not per-event tail latencies. Timing depends on this device and JIT.`));
}
function bind(){
 $('cppLessons').addEventListener('click',ev=>{const b=ev.target.closest('[data-lesson]');if(b)navigate(b.dataset.lesson)});
 $('cppEditor').addEventListener('input',()=>{setRecord({code:$('cppEditor').value});paintEditor()});
 $('cppEditor').addEventListener('scroll',paintEditor);
 $('cppEditor').addEventListener('keydown',ev=>{
  if((ev.metaKey||ev.ctrlKey)&&ev.key==='Enter'){ev.preventDefault();run();return;}
  if(ev.key==='Tab'){ev.preventDefault();const ed=$('cppEditor'),a=ed.selectionStart,b=ed.selectionEnd;ed.setRangeText('    ',a,b,'end');ed.dispatchEvent(new Event('input',{bubbles:true}));}
 });
 $('cppNotes').addEventListener('input',()=>setRecord({notes:$('cppNotes').value.slice(0,20000)}));
 $('runCpp').onclick=run;$('stopCpp').onclick=()=>stopWorker('Compilation or execution cancelled.');
 $('resetCpp').onclick=()=>{if(!confirm('Reset only this lesson’s C++ editor to its starter code?'))return;const code=CPP_LESSONS[index].starter;$('cppEditor').value=code;setRecord({code});paintEditor()};
 $('downloadCpp').onclick=()=>{const c=CPP_LESSONS[index];downloadFile('mastery-'+c.id+'.cpp',CPP_PREAMBLE+'\n'+(c.prelude||'')+'\n'+$('cppEditor').value+'\n')};
 $('tracePrev').onclick=()=>{step=Math.max(0,step-1);renderTrace()};$('traceNext').onclick=()=>{step=Math.min(CPP_REFERENCE_TRACES[CPP_LESSONS[index].id].length-1,step+1);renderTrace()};
 $('exportCpp').onclick=exportProgress;$('importCpp').onchange=ev=>{restoreProgress(ev.target.files?.[0]);ev.target.value=''};
 $('benchRun').onclick=benchmark;
}
const start=(location.hash.match(/lab=([a-z-]+)/)||[])[1];index=Math.max(0,CPP_LESSONS.findIndex(x=>x.id===start));bind();render();