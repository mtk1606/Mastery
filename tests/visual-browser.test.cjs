'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const base='http://127.0.0.1:8901/';
 const browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce',acceptDownloads:true});
 await ctx.addInitScript(()=>localStorage.setItem('mastery-theme','dark'));
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 const scenePaths={
  'c0-state':'C0','c0-contract':'C0','c0-edge':'C0','c0-recall':'C0',
  'c1-values':'C1','c1-control':'C1','c1-functions':'C1','c1-objects':'C1','c1-exceptions':'C1',
  'c2-growth':'C2','c2-hash':'C2','c2-windows':'C2','c2-binary':'C2','c2-structures':'C2','c2-graphs':'C2'
 };
 for(const [id,stage] of Object.entries(scenePaths)){
  const response=await page.goto(base+'foundation.html#'+stage+'/'+id,{waitUntil:'domcontentloaded'});
  if(response)assert(response.ok(),id+' lesson load failed');
  await page.waitForFunction(sceneId=>document.querySelector('.mv-top h4')?.textContent===window.MasteryVisualScenes.lookup(sceneId)?.title,id);
  await page.locator('.mv-svg').waitFor();
  assert.equal(await page.locator('.mv').count(),1,id+' missing integrated figure');
  assert((await page.locator('.mv-svg title').textContent()).length>15);
  assert((await page.locator('.mv-explanation p').textContent()).length>55);
  assert.equal(await page.locator('.mv-svg').getAttribute('role'),'img');
  assert.equal(await page.locator('.mv-option').count(),3);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()),'#0b0b0c');
  await page.locator('[data-mv-action="next"]').click();
  assert.match(await page.locator('.mv-count').textContent(),/02/);
  await page.locator('[data-mv-action="previous"]').click();
  assert.match(await page.locator('.mv-count').textContent(),/01/);
  await page.locator('[data-mv-action="mode-text"]').click();
  assert.equal(await page.locator('.mv-steps li').count(),await page.evaluate(x=>window.MasteryVisualScenes.lookup(x).frames.length,id));
  await page.locator('[data-mv-action="mode-visual"]').click();
  assert.equal(await page.locator('.mv-svg').count(),1);
 }
 await page.goto(base+'foundation.html#C2/c2-windows',{waitUntil:'domcontentloaded'});
 await page.locator('[data-mv-param="window"]').selectOption('3');
 assert.equal(await page.locator('.mv-count').textContent().then(x=>x.trim().replace(/\s+/g,' ')),'01 / 02');
 assert.match(await page.locator('.mv-explanation p').textContent(),/k=3/);
 await page.locator('[data-mv-action="next"]').click();
 assert.match(await page.locator('.mv-explanation p').textContent(),/sum is 9/);
 await page.goto(base+'foundation.html#C2/c2-binary',{waitUntil:'domcontentloaded'});
 await page.locator('[data-mv-param="binary"]').selectOption('6');
 for(let i=0;i<2;i++)await page.locator('[data-mv-action="next"]').click();
 assert.match(await page.locator('.mv-explanation p').textContent(),/return -1/);
 const before=await page.evaluate(()=>localStorage.getItem('mastery-foundation-v1'));
 await page.locator('[data-mv-action="answer"]').first().click();
 assert.equal(await page.locator('.mv-feedback').count(),1);
 assert.equal(await page.evaluate(()=>localStorage.getItem('mastery-foundation-v1')),before,'Prediction must never fabricate learning credit');
 await page.locator('[data-mv-action="answer-reset"]').click();
 assert.equal(await page.locator('.mv-feedback').count(),0);
 await page.locator('[data-mv-action="play"]').click();
 assert.match(await page.locator('[data-mv-action="play"]').textContent(),/Pause/);
 await page.locator('[data-mv-action="play"]').click();
 assert.match(await page.locator('[data-mv-action="play"]').textContent(),/Play/);
 await page.locator('[data-mv-action="replay"]').click();
 assert.match(await page.locator('.mv-count').textContent(),/01/);
 await page.setViewportSize({width:390,height:844});
 const dim=await page.evaluate(()=>({screen:innerWidth,root:document.documentElement.scrollWidth,scrollable:document.querySelector('.mv-canvas').scrollWidth>document.querySelector('.mv-canvas').clientWidth}));
 assert(dim.root<=dim.screen+3,'Responsive diagram escaped page: '+JSON.stringify(dim));
 assert(dim.scrollable,'Narrow device must allow pan instead of shrinking labels into illegibility');
 await page.goto(base+'foundation.html#C0/c0-path',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.mv').count(),0,'Unmapped lessons should retain original text-only instruction');
 assert.deepEqual(errors,[],'Unhandled browser errors: '+errors.join('; '));
 await browser.close();
 console.log('PASS: 15 visually integrated live SVG labs; stepper, original accessible text trace, live changeable inputs, prediction, playback, no credit pollution, dark palette, reduced motion, 390px pan and unmodified legacy lessons.');
})().catch(e=>{console.error(e);process.exit(1)});
