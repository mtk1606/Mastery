'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const base='http://127.0.0.1:8901/';
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:940},reducedMotion:'reduce'});
 await context.addInitScript(()=>localStorage.setItem('mastery-theme','dark'));
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 fs.mkdirSync('visual-review',{recursive:true});
 await page.goto(base+'insertion-sort.html',{waitUntil:'domcontentloaded'});
 await page.locator('.fig-panel').first().waitFor();
 assert.equal(await page.locator('.fig-panel').count(),6);
 const titleLayout=await page.evaluate(()=>{
  const e=document.querySelector('.fig-eyebrow').getBoundingClientRect(),h=document.querySelector('.fig-head h2').getBoundingClientRect(),p=document.querySelector('.fig-lede').getBoundingClientRect();
  return {eyebrow:e.x,eyebrowBottom:e.bottom,title:h.x,titleTop:h.y,titleBottom:h.bottom,lede:p.x,ledeTop:p.y};
 });
 assert(Math.abs(titleLayout.title-titleLayout.eyebrow)<25&&Math.abs(titleLayout.lede-titleLayout.eyebrow)<25,'Desktop title and subtitle must align with figure eyebrow: '+JSON.stringify(titleLayout));
 assert(titleLayout.titleTop>=titleLayout.eyebrowBottom-1&&titleLayout.ledeTop>=titleLayout.titleBottom-1,'Title and description must follow vertically: '+JSON.stringify(titleLayout));
 assert.equal(await page.locator('.fig-panel-svg').count(),6);
 assert.equal(await page.locator('.fig-shift-arrow').count(),9,'9 exact right-shift arrows expected for mixed input');
 assert.equal(await page.locator('.fig-key-arrow').count(),5);
 assert.equal(await page.locator('.fig-code li').count(),7);
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.screenshot({path:'visual-review/insertion-sort-desktop.png',fullPage:true});
 await page.locator('[data-fig-pass="5"]').click();
 assert.match(await page.locator('.fig-array-read').textContent(),/2\s*·\s*3\s*·\s*4\s*·\s*6\s*·\s*7\s*·\s*8/);
 assert.equal(await page.locator('.fig-panel.is-active').count(),1);
 assert.equal(await page.locator('[data-fig-pass="5"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-fig-action="replay"]').click();
 assert.match(await page.locator('.fig-progress-label').textContent(),/01 \/ 6/);
 await page.locator('[data-fig-action="next"]').click();
 assert.match(await page.locator('.fig-progress-label').textContent(),/02 \/ 6/);
 await page.locator('[data-fig-action="prev"]').click();
 assert.match(await page.locator('.fig-progress-label').textContent(),/01 \/ 6/);
 await page.locator('#figDataset').selectOption('sorted');
 assert.equal(await page.locator('.fig-shift-arrow').count(),0,'Sorted data must move no elements');
 await page.locator('[data-fig-pass="5"]').click();
 assert.match(await page.locator('.fig-array-read').textContent(),/2\s*·\s*4\s*·\s*6\s*·\s*8\s*·\s*9\s*·\s*10/);
 await page.locator('#figDataset').selectOption('reverse');
 assert.equal(await page.locator('.fig-shift-arrow').count(),15,'Reverse data needs 1+2+3+4+5 shifts');
 await page.locator('[data-fig-action="play"]').click();
 assert.match(await page.locator('[data-fig-action="play"]').textContent(),/Pause/);
 await page.locator('[data-fig-action="play"]').click();
 assert.match(await page.locator('[data-fig-action="play"]').textContent(),/Play/);
 await page.setViewportSize({width:390,height:844});
 const mobile=await page.evaluate(()=>({width:innerWidth,page:document.documentElement.scrollWidth}));
 assert(mobile.page<=mobile.width+3,'Insertion figure horizontally overflows: '+JSON.stringify(mobile));
 await page.screenshot({path:'visual-review/insertion-sort-mobile.png',fullPage:true});
 // Verify the actual visual, not merely the model values: one mark per population member,
 // labels entirely inside the SVG viewBox, and no clipped bottom caption.
 await page.setViewportSize({width:1366,height:900});
 await page.goto(base+'foundation.html#C3/c3-counting',{waitUntil:'domcontentloaded'});
 await page.locator('.mv-plate-paper').waitFor();
 assert.match(await page.locator('.fd-example').textContent(),/Among 1,000 people: 10 affected/);
 const glyphSelector='#fdVisual .mv-bayes-population rect';
 assert.equal(await page.locator(glyphSelector).count(),1000,'Each square must stand for exactly one person');
 async function checkGeometry(stage){
  const bad=await page.locator('#fdVisual .mv-svg').evaluate(svg=>{
   const view=svg.viewBox.baseVal;
   return [...svg.querySelectorAll('text')].map(el=>({label:el.textContent.trim(),box:el.getBBox()}))
    .filter(({box})=>box.x < -1||box.y < -1||box.x+box.width>view.width+1||box.y+box.height>view.height+1)
    .map(({label,box})=>({label,coords:[box.x,box.y,box.width,box.height]}));
  });
  assert.deepEqual(bad,[],'Clipped textbook labels in '+stage+': '+JSON.stringify(bad));
 }
 await checkGeometry('default Bayes');
 await page.screenshot({path:'visual-review/bayes-frequency-desktop.png',fullPage:true});
 await page.locator('[data-mv-param="bayes"]').selectOption('25');
 assert.equal(await page.locator(glyphSelector).count(),1000);
 await checkGeometry('25% prior');
 const svg=page.locator('#fdVisual .mv-svg');
 assert.match(await svg.textContent(),/225 people|225/);
 for(let i=0;i<4;i++)await page.locator('[data-mv-action="next"]').click();
 assert.match(await page.locator('.mv-explanation p').textContent(),/75.00%/);
 await checkGeometry('Bayes posterior');
 await page.screenshot({path:'visual-review/bayes-posterior-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 const bayesMobile=await page.evaluate(()=>({width:innerWidth,page:document.documentElement.scrollWidth,pan:document.querySelector('.mv-canvas').scrollWidth>document.querySelector('.mv-canvas').clientWidth}));
 assert(bayesMobile.page<=bayesMobile.width+3,'Bayes figure overflows mobile screen');
 assert(bayesMobile.pan,'Bayes diagram should pan while keeping labels readable');
 assert.deepEqual(errors,[],'Unhandled browser JS errors: '+errors.join(' | '));
 await browser.close();
 console.log('PASS: 6 original textbook figure panels, real shift arrows for three inputs, linked pseudocode, dark/mobile, 1,000 accurate Bayes glyphs, no clipped SVG text and recorded visual QA screenshots.');
})().catch(error=>{console.error(error);process.exitCode=1});
