/* Mastery: one accessible light/dark preference shared across course pages. */
(function(){
  'use strict';
  const key='mastery-theme';
  let value='light';
  try {const stored=localStorage.getItem(key);if(stored==='light'||stored==='dark')value=stored;}catch(e){}
  document.documentElement.dataset.theme=value;
  window.setMasteryTheme=function(mode){
    if(mode!=='light'&&mode!=='dark')return;
    document.documentElement.dataset.theme=mode;
    try{localStorage.setItem(key,mode);}catch(e){}
    document.querySelectorAll('[data-set-theme]').forEach(el=>{
      const active=el.dataset.setTheme===mode;
      el.setAttribute('aria-pressed',String(active));
      el.classList.toggle('chosen',active);
    });
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=mode==='light'?'#ffffff':'#151c24';
  };
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-set-theme]').forEach(el=>el.addEventListener('click',()=>window.setMasteryTheme(el.dataset.setTheme)));
    window.setMasteryTheme(document.documentElement.dataset.theme);
  });
})();
