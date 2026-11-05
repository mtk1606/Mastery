'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const base='http://127.0.0.1:8901/';
 const browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce',acceptDownloads:true});
 await ctx.addInitScript(()=>localStorage.setItem('mastery-theme','dark'));
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 async function visit(id){
  await page.goto(base+'foundation.html#C4/'+id,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(key=>document.querySelector('.mv-top h4')?.textContent===window.MasteryVisualScenes.lookup(key)?.title,id);
  assert.equal(await page.locator('.mv-svg').count(),1,id+' missing renderer');
  assert.equal(await page.locator('.mv-svg').getAttribute('role'),'img');
  assert((await page.locator('.mv-svg desc').textContent()).length>=55);
 }
 async function finish(){
  for(let i=0;i<9;i++){
   const next=page.locator('[data-mv-action="next"]');
   if(await next.isDisabled())break;
   await next.click();
  }
  assert(await page.locator('[data-mv-action="next"]').isDisabled(),'Stepper did not finish scene');
 }
 const chapters=['c4-testing','c4-git','c4-profiling','c4-sql','c4-apis','c4-failures'];
 for(const id of chapters){
  await visit(id);
  assert.equal(await page.locator('.mv-option').count(),3);
  await page.locator('[data-mv-action="next"]').click();
  assert.match(await page.locator('.mv-count').textContent(),/02/);
  await page.locator('[data-mv-action="previous"]').click();
  assert.match(await page.locator('.mv-count').textContent(),/01/);
  await page.locator('[data-mv-action="mode-text"]').click();
  assert((await page.locator('.mv-steps li').count())>=4);
  await page.locator('[data-mv-action="mode-visual"]').click();
  assert.equal(await page.locator('.mv-svg').count(),1);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 }
 await visit('c4-testing');await finish();
 assert.match(await page.locator('.mv-svg').textContent(),/AAPL: 17/);
 await page.locator('[data-mv-param="sys-dedup"]').selectOption('naive');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/AAPL: 1016/);
 await page.locator('[data-mv-param="sys-tape"]').selectOption('conflict');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/MSFT: 905/);
 await page.locator('[data-mv-param="sys-dedup"]').selectOption('durable');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/AAPL: 17/);
 assert.match(await page.locator('.mv-svg').textContent(),/MSFT: 5/);
 await visit('c4-git');await finish();
 assert.match(await page.locator('.mv-svg').textContent(),/returns 0/);
 assert.match(await page.locator('.mv-svg').textContent(),/returns -1/);
 await page.locator('[data-mv-param="sys-fixture"]').selectOption('positive');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/returns 4/);
 await visit('c4-profiling');await finish();
 assert.match(await page.locator('.mv-svg').textContent(),/p95/);
 assert.match(await page.locator('.mv-svg').textContent(),/p99/);
 assert.match(await page.locator('.mv-svg').textContent(),/400 ms/);
 await page.locator('[data-mv-param="sys-workload"]').selectOption('burst');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/50 ms/);
 assert.match(await page.locator('.mv-question').textContent(),/100-request workload/);
 await page.locator('[data-mv-param="sys-workload"]').selectOption('steady');
 await finish();assert.match(await page.locator('.mv-question').textContent(),/20-request workload/);
 await visit('c4-sql');await finish();
 assert.match(await page.locator('.mv-svg').textContent(),/Conservation: 150 \/ 150/);
 await page.locator('[data-mv-param="sys-transaction"]').selectOption('unprotected');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/violated: 120 \/ 150/);
 await page.locator('[data-mv-param="sys-failure"]').selectOption('success');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/Conservation: 150 \/ 150/);
 await page.locator('[data-mv-param="sys-transaction"]').selectOption('atomic');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/Conservation: 150 \/ 150/);
 await visit('c4-apis');await finish();
 assert.match(await page.locator('.mv-svg').textContent(),/Order count: 1/);
 await page.locator('[data-mv-param="sys-retry"]').selectOption('new-key');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/Order count: 2/);
 await visit('c4-failures');await finish();
 assert.match(await page.locator('.mv-svg').textContent(),/ACTUAL: 1/);
 await page.locator('[data-mv-param="sys-race"]').selectOption('locked');
 await finish();assert.match(await page.locator('.mv-svg').textContent(),/ACTUAL: 2/);
 const before=await page.evaluate(()=>localStorage.getItem('mastery-foundation-v1'));
 await page.locator('[data-mv-action="answer"]').first().click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('mastery-foundation-v1')),before,'Visuals must not fabricate objective learning credit');
 await page.locator('[data-mv-action="answer-reset"]').click();
 await page.locator('[data-mv-action="play"]').click();
 assert.match(await page.locator('[data-mv-action="play"]').textContent(),/Pause/);
 await page.locator('[data-mv-action="play"]').click();
 await page.setViewportSize({width:390,height:844});
 const dims=await page.evaluate(()=>({width:innerWidth,page:document.documentElement.scrollWidth,pan:document.querySelector('.mv-canvas').scrollWidth>document.querySelector('.mv-canvas').clientWidth}));
 assert(dims.page<=dims.width+3,'Mobile overflow: '+JSON.stringify(dims));
 assert(dims.pan,'SVG must be horizontally pannable on mobile');
 assert.deepEqual(errors,[],'Browser errors: '+errors.join('; '));
 await browser.close();
 console.log('PASS: six interactive C4 systems visualizations in Chromium; failure/recovery parameter changes, real computed state, latency percentiles, existing progress separation, graphite theme, text trace, keyboard controls and 390px mobile.');
})().catch(e=>{console.error(e);process.exit(1)});
