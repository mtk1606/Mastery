/* Browser reference model, independently written to clarify semantics.
 * Reuses the tested Phase III JS book; it does not trace arbitrary C++ machine code. */
(function(root,build){const base=typeof module==='object'&&module.exports?require('./exchange-sim.js'):root.MasteryExchangeSim;
 const api=build(base);if(typeof module==='object'&&module.exports)module.exports=api;root.MasteryReliabilitySim=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(base){
 'use strict';
 const {Engine}=base;
 const textEncoder=new TextEncoder();
 const fnv=s=>{let h=14695981039346656037n;for(const b of textEncoder.encode(s)){h^=BigInt(b);h=h*1099511628211n & 0xffffffffffffffffn;}return h.toString();};
 const safe=n=>Number.isSafeInteger(n);
 class Venue {
  constructor(symbols=['AAPL','MSFT'],epoch=1){
   if(!safe(epoch)||epoch<=0||!Array.isArray(symbols)||!symbols.length||symbols.length>64)throw Error('Invalid venue configuration');
   this.names=[...symbols].sort();if(new Set(this.names).size!==this.names.length||this.names.some(s=>!/^[A-Z][A-Z0-9_]{0,11}$/.test(s)))throw Error('Invalid symbols');
   this.books=new Map(this.names.map(s=>[s,new Engine()]));this.epoch=epoch;this.seq=0;
  }
  apply(e){
   if(e.epoch<this.epoch)return {accepted:false,reason:'FENCED_EPOCH',fills:[]};
   if(e.epoch>this.epoch)return {accepted:false,reason:'UNKNOWN_EPOCH',fills:[]};
   if(!safe(e.seq)||e.seq!==this.seq+1)return {accepted:false,reason:'SEQ_GAP_OR_REPLAY',fills:[]};
   this.seq=e.seq;const book=this.books.get(e.symbol);
   if(!book)return {accepted:false,reason:'UNKNOWN_SYMBOL',fills:[]};
   return book.apply({...e,seq:book.seq+1});
  }
  promote(epoch){if(!safe(epoch)||epoch<=this.epoch)return false;this.epoch=epoch;return true;}
  canonical(){let s=`epoch=${this.epoch};global=${this.seq};`;for(const sym of this.names)s+=`${sym}{${this.books.get(sym).canonical()}};`;return s;}
  fingerprint(){return fnv(this.canonical());}
  invariant(){let sum=0;for(const b of this.books.values()){if(!b.invariant()||b.seq>this.seq)return false;sum+=b.seq;}return sum<=this.seq;}
  snapshot(){return {epoch:this.epoch,seq:this.seq,hash:this.fingerprint(),canonical:this.canonical(),books:this.names.map(sym=>({symbol:sym,...this.books.get(sym).snapshot()}))};}
  checkpoint(){let s=`MASTERY_CHECKPOINT 1\n${this.epoch} ${this.seq} ${this.names.length}\n`;
   for(const sym of this.names){const b=this.books.get(sym),orders=[];
    for(const side of ['buy','sell'])for(const level of b.levels(side))for(const o of level.items)orders.push({id:o.id,side,price:level.price,qty:o.qty});
    s+=`"${sym}" ${b.seq} ${b.trades} ${orders.length}\n`;
    for(const o of orders)s+=`${o.id} ${o.side==='buy'?'B':'S'} ${o.price} ${o.qty}\n`;
   }
   return s+`CHECK ${fnv(s)}\n`;
  }
  restore(value){
   if(typeof value!=='string'||value.length>2000000)throw Error('Checkpoint too large');
   const k=value.lastIndexOf('CHECK ');if(k<0||(k>0&&value[k-1]!=='\n'))throw Error('Missing checksum');
   const payload=value.slice(0,k),suffix=value.slice(k);
   if(suffix!==`CHECK ${fnv(payload)}\n`)throw Error('Corrupt checkpoint checksum');
   const lines=payload.trimEnd().split('\n');
   if(lines.shift()!=='MASTERY_CHECKPOINT 1')throw Error('Unsupported checkpoint');
   let header=lines.shift()?.split(' ');
   if(header?.length!==3||header.some(x=>!/^(0|[1-9]\d*)$/.test(x)))throw Error('Invalid checkpoint header');
   let [epoch,seq,count]=header.map(Number);
   if(![epoch,seq,count].every(safe)||epoch<=0||count!==this.names.length)throw Error('Invalid epoch/symbols');
   const candidate=new Venue(this.names,epoch);candidate.seq=seq;
   let totalOrders=0;
   for(const symbol of this.names){
    const line=lines.shift();const m=line?.match(/^"([A-Z][A-Z0-9_]{0,11})" (\d+) (\d+) (\d+)$/);
    if(!m||m[1]!==symbol)throw Error('Symbol mismatch');
    const [local,trades,countOrders]=m.slice(2).map(Number);
    if(![local,trades,countOrders].every(safe)||local>seq||countOrders>100000||totalOrders+countOrders>100000)throw Error('Invalid count');
    totalOrders+=countOrders;
    const b=candidate.books.get(symbol);b.seq=local;b.trades=trades;
    for(let n=0;n<countOrders;n++){
     const fields=lines.shift()?.split(' ');
     if(fields?.length!==4||!/^\d+$/.test(fields[0])||!['B','S'].includes(fields[1])||!/^\d+$/.test(fields[2])||!/^\d+$/.test(fields[3]))throw Error('Invalid resting order');
     const [id,side,price,qty]=[Number(fields[0]),fields[1]==='B'?'buy':'sell',Number(fields[2]),Number(fields[3])];
     if(![id,price,qty].every(safe)||id<=0||price<=0||price>1e12||qty<=0||qty>1000000||b.active.has(id))throw Error('Invalid order data');
     const levels=side==='buy'?b.bids:b.asks;if(!levels.has(price))levels.set(price,[]);
     levels.get(price).push({id,qty});b.active.set(id,{side,price});
    }
    if(!b.invariant())throw Error('Invalid restored book');
   }
   if(lines.length||!candidate.invariant())throw Error('Invalid trailing content');
   this.epoch=candidate.epoch;this.seq=candidate.seq;this.books=candidate.books;
  }
 }
 class Fanout {
  constructor(capacity=2){if(!safe(capacity)||capacity<1||capacity>16)throw Error('Capacity 1–16');this.capacity=capacity;this.seq=0;
   this.clients=new Map([['fast',{last:0,queue:[]}],['slow',{last:0,queue:[]}]]);
  }
  publish(){if([...this.clients.values()].some(c=>c.queue.length>=this.capacity))return 'BACKPRESSURE';
   const seq=this.seq+1;for(const c of this.clients.values())c.queue.push(seq);this.seq=seq;return 'ACCEPTED';}
  drain(name){const client=this.clients.get(name);if(!client?.queue.length)return null;
   const seq=client.queue.shift();if(seq!==client.last+1)throw Error('Subscriber gap');client.last=seq;return seq;}
  snapshot(){return {capacity:this.capacity,seq:this.seq,clients:[...this.clients].map(([id,c])=>({id,last:c.last,queue:[...c.queue]}))};}
 }
 const tape=[
 {epoch:1,seq:1,symbol:'AAPL',kind:'limit',id:1,side:'sell',price:101,qty:7},
 {epoch:1,seq:2,symbol:'MSFT',kind:'limit',id:2,side:'sell',price:205,qty:4},
 {epoch:1,seq:3,symbol:'AAPL',kind:'limit',id:3,side:'sell',price:101,qty:5},
 {epoch:1,seq:4,symbol:'AAPL',kind:'market',id:4,side:'buy',price:0,qty:8},
 {epoch:1,seq:5,symbol:'MSFT',kind:'limit',id:5,side:'buy',price:202,qty:10},
 {epoch:1,seq:6,symbol:'AAPL',kind:'limit',id:6,side:'buy',price:99,qty:3},
 {epoch:1,seq:7,symbol:'MSFT',kind:'cancel',id:2,side:'buy',price:0,qty:0},
 {epoch:1,seq:8,symbol:'MSFT',kind:'limit',id:8,side:'sell',price:203,qty:5},
 {epoch:1,seq:9,symbol:'MSFT',kind:'market',id:9,side:'buy',price:0,qty:3},
 {epoch:1,seq:10,symbol:'AAPL',kind:'limit',id:10,side:'buy',price:100,qty:6}
 ];
 function replayScenario(mode='normal'){
  const venue=new Venue(),frames=[];let out;
  for(let i=0;i<5;i++)venue.apply(tape[i]);const saved=venue.checkpoint();
  let checkpoint=saved;if(mode==='corrupt')checkpoint=checkpoint.replace('AAPL','XBPL');
  const standby=new Venue();
  try{standby.restore(checkpoint);}catch(error){frames.push({step:'Checkpoint rejected',message:error.message,snapshot:standby.snapshot(),ok:false});return {frames,expectedHash:null,checkpoint:saved};}
  frames.push({step:'Checkpoint restored at 5',message:'Restored FIFO queues and per-symbol counters from validated checkpoint.',snapshot:standby.snapshot(),ok:true});
  const work=tape.slice(5).map(e=>({...e}));
  if(mode==='gap')work.splice(1,1);
  if(mode==='duplicate')work.splice(1,0,{...work[0]});
  for(const input of work){
    out=standby.apply(input);frames.push({step:`Global ${input.seq} · ${input.symbol}`,message:out.reason,raw:input,output:out,snapshot:standby.snapshot(),ok:out.reason!=='SEQ_GAP_OR_REPLAY'});
    if(out.reason==='SEQ_GAP_OR_REPLAY')break;
  }
  if(mode==='stale'||mode==='normal'){
   standby.promote(2);frames.push({step:'Epoch 2 promotion',message:'Promoted recovery leader; no matching state changed.',snapshot:standby.snapshot(),ok:true});
   out=standby.apply({...tape[0],seq:11});
   frames.push({step:'Old leader message',message:out.reason,output:out,snapshot:standby.snapshot(),ok:out.reason==='FENCED_EPOCH'});
  }
  return {frames,checkpoint:saved,expectedHash:'780225790431407597'};
 }
 return {Venue,Fanout,tape,replayScenario,fnv};
});