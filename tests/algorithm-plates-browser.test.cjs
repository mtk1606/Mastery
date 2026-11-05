'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce'});
 await context.addInitScript(()=>localStorage.setItem('mastery-theme','dark'));
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 fs.mkdirSync('visual-review',{recursive:true});
 const cases=[
  {id:'c2-windows',kind:'window',count:3},
  {id:'c2-binary',kind:'binary',count:4},
  {id:'c2-structures',kind:'bfs',count:5},
  {id:'c2-graphs',kind:'dp',count:4}
 ];
 async function goto(c){
  await page.goto('http://127.0.0.1:8901/foundation.html#C2/'+c.id,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(id=>document.querySelector('.mv')?.querySelector('[data-plate-kind]')?.dataset.plateKind===id,c.kind);
 }
 async function verifyGeometry(kind){
  const faults=await page.locator('.mv-plate-svg').evaluate(svg=>{
   const view=svg.viewBox.baseVal;
   const errors=[];
   const textNodes=Array.from(svg.querySelectorAll('text'));
   for(const node of textNodes){
    const rect=node.getBBox(),m=node.getScreenCTM();
    if(!m)continue;
    const corners=[[rect.x,rect.y],[rect.x+rect.width,rect.y],[rect.x,rect.y+rect.height],[rect.x+rect.width,rect.y+rect.height]];
    const points=corners.map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));
    const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
    const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
    // Since SVG could be CSS-scaled, convert from screen coordinates to viewBox units.
    // getCTM is already viewport-scale aware, so reference against transformed viewBox bounds.
    const outer=svg.getScreenCTM();
    const p0={x:outer.a*0+outer.e,y:outer.d*0+outer.f};
    const p1={x:outer.a*view.width+outer.e,y:outer.d*view.height+outer.f};
    if(minX<p0.x-2||maxX>p1.x+2||minY<p0.y-2||maxY>p1.y+2)
       errors.push({text:node.textContent.trim(),edge:[Math.round(minX),Math.round(maxX),Math.round(minY),Math.round(maxY)]});
   }
   return errors;
  });
  assert.deepEqual(faults,[],'Clipped text in '+kind+': '+JSON.stringify(faults));
 }
 for(const c of cases){
  await goto(c);
  assert.equal(await page.locator('.mv-plate').count(),1,c.id+' needs a real full-sequence plate');
  assert.equal(await page.locator('.mv-plate-svg').getAttribute('role'),'img');
  assert.equal(await page.locator('[data-plate-panel]').count(),c.count);
  assert.equal(await page.locator('.mv-plate-step-choice').count(),c.count);
  assert.equal(await page.locator('.mv-plate-code').count(),1);
  assert.equal(await page.locator('.mv-plate-code-line.is-highlighted').count(),1);
  assert.equal(await page.locator('[data-plate-panel].plate-panel-selected').count(),1);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert((await page.locator('.mv-plate-caption').textContent()).length>80);
  await verifyGeometry(c.kind);
  await page.locator('.mv-plate').screenshot({path:'visual-review/algorithm-plate-'+c.kind+'.png'});
  const choice=page.locator('.mv-plate-step-choice').nth(c.count-1);
  await choice.click();
  assert.equal(await choice.getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('[data-plate-panel].plate-panel-selected').getAttribute('data-plate-panel'),String(c.count-1));
  assert((await page.locator('.mv-count').textContent()).includes('0'+c.count),'Step counter did not update');
  await page.locator('[data-mv-action="replay"]').click();
  assert.equal(await page.locator('[data-plate-panel].plate-panel-selected').getAttribute('data-plate-panel'),'0');
  await page.locator('[data-mv-action="next"]').click();
  assert.equal(await page.locator('[data-plate-panel].plate-panel-selected').getAttribute('data-plate-panel'),'1');
  await page.locator('[data-mv-action="mode-text"]').click();
  assert.equal(await page.locator('.mv-steps li').count(),c.count);
  await page.locator('[data-mv-action="mode-visual"]').click();
  assert.equal(await page.locator('.mv-plate-svg').count(),1);
 }
 await goto(cases[0]);
 await page.locator('[data-mv-param="window"]').selectOption('3');
 assert.equal(await page.locator('[data-plate-panel]').count(),2);
 assert.match(await page.locator('.mv-question').textContent(),/k=3/);
 await page.locator('[data-mv-action="answer"][data-mv-choice="1"]').click();
 assert.match(await page.locator('.mv-feedback').textContent(),/Correct prediction/);
 await page.locator('[data-mv-param="window"]').selectOption('4');
 assert.equal(await page.locator('[data-plate-panel]').count(),1);
 assert.match(await page.locator('.mv-question').textContent(),/k=4/);
 await verifyGeometry('window k4');
 await goto(cases[1]);
 await page.locator('[data-mv-param="binary"]').selectOption('6');
 assert.match(await page.locator('.mv-question').textContent(),/target 6/);
 assert.match(await page.locator('.mv-option[data-mv-choice="1"]').textContent(),/-1/);
 await page.locator('[data-mv-action="answer"][data-mv-choice="1"]').click();
 assert.match(await page.locator('.mv-feedback').textContent(),/Correct prediction/);
 await verifyGeometry('binary absent target');
 const before=await page.evaluate(()=>localStorage.getItem('mastery-foundation-v1'));
 await page.locator('[data-mv-action="answer-reset"]').click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('mastery-foundation-v1')),before,'Diagram must not earn objective grading');
 await page.setViewportSize({width:390,height:844});
 const dims=await page.evaluate(()=>({root:document.documentElement.scrollWidth,width:innerWidth,pan:document.querySelector('.mv-canvas').scrollWidth>document.querySelector('.mv-canvas').clientWidth}));
 assert(dims.root<=dims.width+3,'Mobile page overflow '+JSON.stringify(dims));
 assert(dims.pan,'Full textbook plate should pan within canvas on mobile');
 await page.locator('.mv-plate').screenshot({path:'visual-review/algorithm-plate-binary-mobile.png'});
 assert.deepEqual(errors,[],'Browser errors '+errors.join('; '));
 await browser.close();
 console.log('PASS: full textbook figure plates on 4 C2 lessons; SVG text geometry, all panels, synced code, parameter variants, step jumping, motion, mobile panning, and progress integrity.');
})().catch(e=>{console.error(e);process.exitCode=1});
