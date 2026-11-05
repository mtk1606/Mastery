'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true}),context=await browser.newContext({viewport:{width:1280,height:870},acceptDownloads:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8786/phase10.html',{waitUntil:'domcontentloaded'});
 await page.locator('#xTrack').selectOption('quantdev');
 await page.locator('#xDuration').selectOption('45');
 await page.locator('[data-act="start"]').click();
 assert.match(await page.locator('#xTaskTitle').innerText(),/search|queue|cache|latency|rate|Poisson|making|overload|retry|probability|completion/i);
 const get=()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('mastery-phase10-v1'));return {session:x.session,data:x.session.drafts[String(x.session.position)]};});
 let t=(await get()).session.tasks[0];
 await page.locator('#xNumber').fill(String(t.answer));await page.locator('#xExplain').fill('I explicitly state independence or conditioning and compute from the model.');
 await page.locator('[data-act="submit-initial"]').click();
 assert.match(await page.locator('.x-feedback').innerText(),/passed/);
 t=(await get()).session.tasks[0];
 await page.locator('#xFollowNumber').fill(String(t.strongAnswer));await page.locator('#xFollowExplain').fill('The changed assumption produces a new expression and I recompute it.');
 await page.locator('[data-act="submit-follow"]').click();
 assert.match(await page.locator('.x-results').innerText(),/Correct/);
 await page.locator('#xSelf').selectOption('3');await page.locator('#xError').selectOption('no error');
 await page.locator('[data-act="complete-stage"]').click();
 assert.equal((await get()).session.position,1);
 t=(await get()).session.tasks[1];await page.locator('#xNumber').fill(String(t.answer+99));await page.locator('#xExplain').fill('This deliberately incorrect value should trigger diagnostic repair.');
 await page.locator('[data-act="submit-initial"]').click();
 assert.match(await page.locator('.x-feedback').innerText(),/did not meet/);
 await page.locator('#xFollowNumber').fill(String(t.repairAnswer));await page.locator('#xFollowExplain').fill('The repair isolates the failed step of the original calculation.');
 await page.locator('[data-act="submit-follow"]').click();
 await page.locator('#xSelf').selectOption('2');await page.locator('#xError').selectOption('arithmetic');await page.locator('[data-act="complete-stage"]').click();
 t=(await get()).session.tasks[2];assert.equal(t.kind,'code');
 const implementations={
 'binary-search':'function search(a,t){let l=0,r=a.length-1;while(l<=r){const m=l+Math.floor((r-l)/2);if(a[m]===t)return m;if(a[m]<t)l=m+1;else r=m-1}return -1}',
 'sliding-window-maximum':'function maxSlidingWindow(a,k){const d=[],ans=[];let head=0;for(let i=0;i<a.length;i++){while(d.length>head&&d[head]<=i-k)head++;while(d.length>head&&a[d[d.length-1]]<=a[i])d.pop();d.push(i);if(i>=k-1)ans.push(a[d[head]])}return ans}',
 'merge-intervals':'function merge(a){const xs=a.map(x=>x.slice()).sort((p,q)=>p[0]-q[0]),out=[];for(const x of xs){const y=out[out.length-1];if(y&&x[0]<=y[1])y[1]=Math.max(y[1],x[1]);else out.push(x)}return out}',
 'coin-change':'function coinChange(c,a){let dp=Array(a+1).fill(Infinity);dp[0]=0;for(let x=1;x<=a;x++)for(const v of c)if(v<=x)dp[x]=Math.min(dp[x],1+dp[x-v]);return Number.isFinite(dp[a])?dp[a]:-1}',
 'lru-cache':'function lruCache(c,ops){const m=new Map(),out=[];for(const op of ops){if(op[0]==="get"){let v=m.has(op[1])?m.get(op[1]):-1;out.push(v);if(m.has(op[1])){m.delete(op[1]);m.set(op[1],v)}}else{m.delete(op[1]);if(c>0){m.set(op[1],op[2]);if(m.size>c)m.delete(m.keys().next().value)}}}return out}'
 };
 await page.locator('#xCode').fill(implementations[t.id]);
 await page.locator('#xExplain').fill('I maintain the algorithm invariant, account for edge cases and derive complexity.');
 await page.locator('[data-seed="0"][data-act="run-code"]').click();
 await page.waitForFunction(()=>document.querySelector('#xTestStatus')?.textContent.includes('tests passed'),{timeout:15000});
 await page.locator('[data-seed="1"][data-act="run-code"]').click();
 await page.waitForFunction(()=>document.querySelector('#xTestStatus')?.textContent.includes('tests passed')&&document.querySelector('#xTestStatus')?.textContent.includes('Batch B'),{timeout:15000});
 assert.equal((await get()).data.passedSeeds.length,2);
 await page.locator('[data-act="submit-initial"]').click();assert.match(await page.locator('.x-feedback').innerText(),/passed/);
 const follow=(await get()).session.tasks[2];await page.locator('input[name="xFollowPick"]').nth(follow.strongAnswer).check();
 await page.locator('#xFollowExplain').fill('I can defend the complexity and explain why the counterexample fails.');
 await page.locator('[data-act="submit-follow"]').click();
 await page.locator('#xSelf').selectOption('4');await page.locator('#xError').selectOption('no error');
 await page.locator('[data-act="complete-stage"]').click();
 assert.match(await page.locator('.x-main h1').innerText(),/held up under pressure/i);
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('mastery-phase10-v1')));
 assert.equal(record.history.length,3);assert.equal(record.sessions.length,1);assert.equal(record.history[2].codePassed,2);
 const d=page.waitForEvent('download');await page.locator('#xExport').click();assert.equal((await d).suggestedFilename(),'mastery-phase10-interviews.json');
 await page.locator('[data-set-theme="dark"]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.body.scrollWidth<=innerWidth+2),'Mobile horizontal overflow');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: conditional follow-ups, real two-seed Worker coding, three-stage round, ledger, export, dark mode, mobile');
})().catch(e=>{console.error(e);process.exit(1)});
