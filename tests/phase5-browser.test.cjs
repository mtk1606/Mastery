'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1350,height:860},acceptDownloads:true});
 const page=await context.newPage();const exceptions=[];
 page.on('pageerror',e=>exceptions.push(e.message));
 const base='http://127.0.0.1:8897/phase5.html';
 const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:20000});
 assert.equal(response.status(),200);
 await page.locator('#phase5Nav a').first().waitFor();
 assert.equal(await page.locator('#phase5Nav a').count(),12);
 assert.match(await page.locator('#phase5Main h2').innerText(),/One log/);
 // A lecture explanation, reference source and saved reasoning.
 await page.locator('#p5LectureDraft').fill('Invariant: every fill belongs to exactly one symbol.');
 await page.locator('[data-reveal]').click();
 assert.match((await page.locator('#phase5Main').innerText()).toLowerCase(),/model reasoning/);
 await page.reload({waitUntil:'domcontentloaded'});
 assert.match(await page.locator('#p5LectureDraft').inputValue(),/exactly one symbol/);
 // Fault explorer exercises actual reference transitions, not screenshots.
 await page.locator('a[href="#recovery"]').click();await page.locator('#p5FrameTitle').waitFor();
 for(const [kind,expected] of [['normal','FENCED_EPOCH'],['gap','SEQ_GAP_OR_REPLAY'],['duplicate','SEQ_GAP_OR_REPLAY'],['corrupt','Corrupt checkpoint checksum']]){
  await page.locator('#p5Scenario').selectOption(kind);await page.locator('#p5Build').click();
  for(let i=0;i<20;i++){
   if(!await page.locator('#p5Next').isEnabled())break;
   await page.locator('#p5Next').click();
  }
  assert.match(await page.locator('#p5FrameMessage').innerText(),new RegExp(expected));
 }
 await page.locator('#p5Scenario').selectOption('normal');await page.locator('#p5Build').click();
 for(let i=0;i<20;i++)if(await page.locator('#p5Next').isEnabled())await page.locator('#p5Next').click();
 assert.match(await page.locator('#p5Hash').innerText(),/780225790431407597/);
 await page.locator('a[href="#fanout"]').click();await page.locator('#p5Publish').waitFor();
 await page.locator('#p5Publish').click();await page.locator('#p5Publish').click();await page.locator('#p5Publish').click();
 assert.match(await page.locator('#p5FeedStatus').innerText(),/BACKPRESSURE/);
 assert.match(await page.locator('#p5FeedSeq').innerText(),/2/);
 await page.locator('#p5DrainSlow').click();await page.locator('#p5Publish').click();
 assert.match(await page.locator('#p5FeedStatus').innerText(),/BACKPRESSURE/);
 await page.locator('#p5DrainFast').click();await page.locator('#p5Publish').click();
 assert.match(await page.locator('#p5FeedStatus').innerText(),/committed/);
 // Timer and self-review deliberately do not claim AI grading.
 await page.locator('a[href="#interview:quantdev"]').click();await page.locator('#p5Clock').waitFor();
 await page.locator('[data-p5-timer="start"]').click();
 assert.match(await page.locator('#p5SessionStatus').innerText(),/RUNNING/);
 await page.locator('[data-p5-note]').fill('We must rebuild the ID index rather than serialize iterator addresses.');
 await page.locator('[data-p5-rubric]').first().check();
 await page.locator('[data-p5-timer="pause"]').click();
 assert.match(await page.locator('#p5SessionStatus').innerText(),/PAUSED/);
 await page.locator('[data-p5-timer="resume"]').click();
 assert.match(await page.locator('#p5SessionStatus').innerText(),/RUNNING/);
 const temp=path.join(os.tmpdir(),'phase5-browser-backup.json');
 const downloadPromise=page.waitForEvent('download');await page.locator('#p5Export').click();const dl=await downloadPromise;
 await dl.saveAs(temp);
 const json=JSON.parse(fs.readFileSync(temp,'utf8'));
 assert.match(json.answers['interview:quantdev'],/rebuild the ID index/);
 assert.deepEqual(json.rubrics.quantdev,[0]);
 assert.equal(json.sessions.quantdev.state,'running');
 // Export → restore round trip through the actual file picker.
 await page.locator('[data-p5-note]').fill('TEMPORARY WRONG DRAFT');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#p5Import').setInputFiles(temp);
 await page.waitForFunction(()=>document.querySelector('#backupMessage')?.textContent.includes('restored'));
 await page.locator('a[href="#interview:quantdev"]').click();
 await page.locator('[data-p5-note]').waitFor();
 assert.match(await page.locator('[data-p5-note]').inputValue(),/rebuild the ID index/);
 // All lecture and interview routes load their own instruction material.
 for(const link of await page.locator('#phase5Nav a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')))){
  await page.locator(`a[href="${link}"]`).click();await page.locator('#phase5Main h2').waitFor();
  assert((await page.locator('#phase5Main h2').innerText()).length>6);
 }
 await page.locator('button[data-set-theme="dark"]').click();
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
 await page.setViewportSize({width:375,height:812});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 assert.deepEqual(exceptions,[]);
 await browser.close();
 console.log('PHASE V BROWSER PASS: 12 routes, saved lectures, checkpoint faults, backpressure, interviews, backup round trip, both themes, mobile; no errors');
})().catch(e=>{console.error(e);process.exit(1)});