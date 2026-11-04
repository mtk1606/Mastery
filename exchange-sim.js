/* Deterministic educational reference replay. Separate from the real native C++ engine.
 * Uses integer price ticks and order quantities. Checks state at every event. */
(function(root,factory){ const api=factory(); if(typeof module==='object'&&module.exports)module.exports=api; root.MasteryExchangeSim=api; })(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MAXQ=1_000_000,MAXP=1_000_000_000_000;
 const clean=x=>Number.isSafeInteger(x);
 class Engine {
  constructor(){this.seq=0;this.trades=0;this.bids=new Map();this.asks=new Map();this.active=new Map();}
  apply(e){
   if(!clean(e.seq)||e.seq!==this.seq+1)return {accepted:false,reason:'SEQ_GAP',fills:[]};
   this.seq=e.seq;
   if(!clean(e.id)||e.id<=0)return {accepted:false,reason:'INVALID_ID',fills:[]};
   if(e.kind==='cancel'){
    const a=this.active.get(e.id);
    if(!a)return {accepted:false,reason:'UNKNOWN_ORDER',fills:[]};
    const levels=a.side==='buy'?this.bids:this.asks;
    const list=levels.get(a.price);list.splice(list.findIndex(o=>o.id===e.id),1);
    if(!list.length)levels.delete(a.price);
    this.active.delete(e.id);return {accepted:true,reason:'CANCELLED',fills:[]};
   }
   if(!['limit','market'].includes(e.kind)||!['buy','sell'].includes(e.side))return {accepted:false,reason:'INVALID_TYPE',fills:[]};
   if(!clean(e.qty)||e.qty<=0||e.qty>MAXQ)return {accepted:false,reason:'INVALID_QUANTITY',fills:[]};
   if(e.kind==='limit'&&(!clean(e.price)||e.price<=0||e.price>MAXP))return {accepted:false,reason:'INVALID_PRICE',fills:[]};
   if(e.kind==='limit'&&this.active.has(e.id))return {accepted:false,reason:'DUPLICATE_ACTIVE_ID',fills:[]};
   let remain=e.qty;const fills=[];
   const opposite=e.side==='buy'?this.asks:this.bids;
   while(remain>0&&opposite.size){
    const best=[...opposite.keys()].sort((a,b)=>e.side==='buy'?a-b:b-a)[0];
    if(e.kind==='limit'&&((e.side==='buy'&&best>e.price)||(e.side==='sell'&&best<e.price)))break;
    const queue=opposite.get(best);
    while(remain>0&&queue.length){
     const o=queue[0],q=Math.min(o.qty,remain);o.qty-=q;remain-=q;this.trades++;
     fills.push({maker:o.id,taker:e.id,price:best,quantity:q});
     if(o.qty===0){this.active.delete(o.id);queue.shift();}
    }
    if(!queue.length)opposite.delete(best);
   }
   if(e.kind==='limit'&&remain>0){const levels=e.side==='buy'?this.bids:this.asks;if(!levels.has(e.price))levels.set(e.price,[]);const item={id:e.id,qty:remain};levels.get(e.price).push(item);this.active.set(e.id,{side:e.side,price:e.price});}
   return {accepted:true,reason:'ACCEPTED',fills};
  }
  levels(side){const levels=side==='buy'?this.bids:this.asks;return [...levels.entries()].sort((a,b)=>side==='buy'?b[0]-a[0]:a[0]-b[0]).map(([price,items])=>({price,items:items.map(x=>({...x})),quantity:items.reduce((n,x)=>n+x.qty,0)}));}
  canonical(){let s=`seq=${this.seq};trades=${this.trades};`;for(const side of ['buy','sell'])for(const level of this.levels(side)){s+=`${side==='buy'?'B':'A'}${level.price}:`;for(const o of level.items)s+=`${o.id}=${o.qty},`;s+=';';}return s;}
  fingerprint(){let h=14695981039346656037n;for(const c of new TextEncoder().encode(this.canonical())){h^=BigInt(c);h=h*1099511628211n&0xffffffffffffffffn;}return h.toString();}
  invariant(){if(this.active.size!==[...this.bids.values(),...this.asks.values()].reduce((n,x)=>n+x.length,0))return false;for(const side of ['buy','sell'])for(const l of this.levels(side))for(const o of l.items){let a=this.active.get(o.id);if(!a||a.side!==side||a.price!==l.price||o.qty<=0)return false;}const bid=this.levels('buy')[0],ask=this.levels('sell')[0];return !bid||!ask||bid.price<ask.price;}
  snapshot(){return {seq:this.seq,trades:this.trades,active:this.active.size,bid:this.levels('buy')[0]||null,ask:this.levels('sell')[0]||null,bids:this.levels('buy'),asks:this.levels('sell'),canonical:this.canonical(),fingerprint:this.fingerprint()};}
 }
 function parseCSV(csv){
  const lines=String(csv).trim().split(/\r?\n/);if(lines.length>252)throw Error('A maximum of 250 events is allowed in this browser demonstration.');
  const arr=[];
  for(let i=0;i<lines.length;i++){
   let line=lines[i].trim();if(!line||line.startsWith('#')||line.startsWith('seq,'))continue;
   const v=line.split(',').map(z=>z.trim());if(v.length!==6)throw Error(`Line ${i+1}: six comma-separated fields required.`);
   if(!/^(\d+)$/.test(v[0])||!/^(\d+)$/.test(v[2])||!/^-?\d+$/.test(v[4])||!/^(\d+)$/.test(v[5]))throw Error(`Line ${i+1}: invalid integer.`);
   const e={seq:Number(v[0]),kind:v[1],id:Number(v[2]),side:v[3],price:Number(v[4]),qty:Number(v[5])};
   if(!['limit','market','cancel'].includes(e.kind)||!['buy','sell'].includes(e.side))throw Error(`Line ${i+1}: unknown kind/side.`);
   if([e.seq,e.id,e.price,e.qty].some(x=>!Number.isSafeInteger(x)))throw Error(`Line ${i+1}: integer outside safe range.`);
   arr.push(e);
  }
  return arr;
 }
 function replay(events){const engine=new Engine(),states=[{event:null,outcome:null,book:engine.snapshot()}];for(const e of events){const out=engine.apply(e);if(!engine.invariant())throw Error('Internal invariant failed');states.push({event:e,outcome:out,book:engine.snapshot()});if(out.reason==='SEQ_GAP')break;}return states;}
 return {Engine,parseCSV,replay};
});