/* Mastery Phase VI: browser-level teaching model of commit and retention semantics.
 * Independent from native WAL; deliberately NOT a live trace or file system. */
(function(root, factory){ const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.MASTERY_P6_MODEL=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const SCENARIOS={
 normal:{title:'Normal commit, retry and conflict',ops:['prepare','append','sync','apply','ack','retry','conflict','crash','recover','retry']},
 before:{title:'Crash before fsync',ops:['prepare','append','crash','recover','retry']},
 after:{title:'Crash after fsync, before apply',ops:['prepare','append','sync','crash','recover','retry','conflict']},
 torn:{title:'Unterminated trailing record',ops:['prepare','partial','crash','recover']},
 corrupt:{title:'Corrupted complete record',ops:['prepare','append','sync','tamper','crash','recover']}
};
const COMMAND={client:'desk7',key:'req-42',order:'BUY 5 AAPL @101'};
function empty(){return {step:'Initial state',details:'No records or acknowledgements exist.',buffer:[],wal:[],applied:[],acknowledged:[],ledger:{},status:'READY',crashed:false,halted:false,checkpoint:'n/a'};}
function copy(s){return JSON.parse(JSON.stringify(s));}
function runOp(s,op){
 switch(op){
 case 'prepare':s.details='Construct command (desk7, req-42) and normalize its payload before writing.';s.status='PREPARED';break;
 case 'append':s.buffer.push('E 1 desk7 req-42 BUY 5 AAPL @101 | checksum');s.details='Bytes were written to an OS buffer. There is no durability acknowledgement yet.';s.status='UNSYNCED';break;
 case 'partial':s.buffer.push('E 1 desk7 req-42 BUY 5… [no newline]');s.details='Only an incomplete final frame exists. This command was never acknowledged.';s.status='TORN_TAIL';break;
 case 'sync':s.wal.push(...s.buffer);s.buffer=[];s.details='The complete record is now in the durable prefix after a successful fsync.';s.status='DURABLE_NOT_APPLIED';break;
 case 'apply':if(!s.wal.length)throw Error('cannot apply uncommitted event');s.applied.push(COMMAND.order);s.ledger[COMMAND.client+'/'+COMMAND.key]=COMMAND.order;s.details='Apply exactly the logged event. Commit ordering prevents an acknowledged but unlogged order.';s.status='APPLIED';break;
 case 'ack':if(!s.applied.length)throw Error('cannot acknowledge unapplied event');s.acknowledged.push('req-42 -> accepted, sequence 1');s.details='Receipt becomes visible only after the durable append, then deterministic application.';s.status='ACKNOWLEDGED';break;
 case 'retry':if(s.ledger['desk7/req-42']){s.details='Client repeats the same key and payload. The durable receipt is returned without a second order.';s.status='IDEMPOTENT_REPLAY';}
 else{s.details='The key is not in the durable ledger. A client can resubmit, but this model does not auto-commit a new command.';s.status='RETRY_CAN_SUBMIT';}break;
 case 'conflict':s.details='The same idempotency key with BUY 7 AAPL @101 is rejected; the prior order is not modified.';s.status=s.ledger['desk7/req-42']?'KEY_CONFLICT':'NO_EXISTING_KEY';break;
 case 'tamper':s.wal=s.wal.map(x=>x.replace('checksum','WRONG_CHECKSUM'));s.details='A fully terminated record has a bad checksum. Recovery must fail closed, not silently skip it.';s.status='CORRUPT_COMPLETE_FRAME';break;
 case 'crash':s.applied=[];s.ledger={};s.acknowledged=[];s.buffer=[];s.crashed=true;s.details='The process dies: volatile state and unsynced trailing bytes disappear. Durable log survives.';s.status='PROCESS_CRASHED';break;
 case 'recover':
  s.crashed=false;
  if(s.wal.some(x=>x.includes('WRONG_CHECKSUM'))){s.halted=true;s.details='Recovery halted. A complete invalid frame is not assumed to be an uncommitted torn tail.';s.status='FAIL_CLOSED';break;}
  s.wal=s.wal.filter(x=>x.includes('checksum'));
  s.applied=s.wal.map(()=>COMMAND.order);
  if(s.applied.length)s.ledger['desk7/req-42']=COMMAND.order;
  s.details=s.applied.length?'Replay the durable prefix, rebuild the idempotency ledger, then accept new traffic.':'Nothing durable was committed. Any torn, unterminated tail was discarded.';
  s.status=s.applied.length?'RECOVERED':'EMPTY_DURABLE_PREFIX';break;
 default:throw Error('unknown operation '+op);
 }
 return s;
}
function frames(name){
 if(!SCENARIOS[name])throw Error('unknown scenario');
 let s=empty();let steps=[copy(s)];
 for(const op of SCENARIOS[name].ops){s=runOp(s,op);s.step=op.toUpperCase().replaceAll('_',' ');steps.push(copy(s));}
 return steps;
}
class Feed {
 constructor(capacity=3,initial=0){if(!Number.isInteger(capacity)||capacity<1||capacity>16||!Number.isInteger(initial)||initial<0)throw Error('invalid feed bounds');this.capacity=capacity;this.latest=initial;this.events=[];this.cursors={};}
 attach(client,seq=this.latest){if(!/^[A-Za-z0-9_-]{1,24}$/.test(client)||seq!==this.latest||Object.hasOwn(this.cursors,client))return false;this.cursors[client]=seq;return true;}
 publish(summary){if(typeof summary!=='string'||summary.length>120)throw Error('summary too long');this.latest++;this.events.push({seq:this.latest,summary});if(this.events.length>this.capacity)this.events.shift();return this.latest;}
 poll(client){if(!Object.hasOwn(this.cursors,client))return {status:'UNKNOWN_SUBSCRIBER'};const cur=this.cursors[client];if(cur===this.latest)return {status:'NO_NEW_EVENTS'};const oldest=this.events.length?this.events[0].seq:this.latest+1;if(cur<oldest-1)return {status:'GAP_NEEDS_SNAPSHOT',oldest};const e=this.events[cur+1-oldest];if(!e||e.seq!==cur+1)throw Error('noncontiguous reference feed');this.cursors[client]=e.seq;return {status:'EVENT',...e};}
 resnapshot(client,seq=this.latest){if(!Object.hasOwn(this.cursors,client)||seq!==this.latest)return false;this.cursors[client]=seq;return true;}
 snapshot(){return {capacity:this.capacity,latest:this.latest,oldest:this.events[0]?.seq??this.latest+1,events:this.events.map(x=>({...x})),cursors:{...this.cursors}};}
}
return {SCENARIOS,COMMAND,frames,Feed};
});