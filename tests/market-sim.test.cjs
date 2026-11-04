const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {Engine,parseCSV,replay}=require('../exchange-sim.js');
const tape=parseCSV(fs.readFileSync(path.resolve(__dirname,'../exchange/fixtures/session.csv'),'utf8'));
const states=replay(tape);
assert.equal(tape.length,12);
assert.equal(states.length,13);
const end=states.at(-1).book;
assert.equal(end.seq,12);assert.equal(end.active,4);assert.equal(end.trades,4);
assert.equal(end.bid.price,100);assert.equal(end.ask.price,102);
assert.equal(end.fingerprint,'15719539211984847471');
assert.equal(end.canonical,'seq=12;trades=4;B100:7=4,;A102:8=2,;A104:2=7,;A105:10=4,;');
for(const f of states)assert.ok(f.book.fingerprint&&f.book.canonical);
const fifo=parseCSV('seq,kind,id,side,price,quantity\n1,limit,11,sell,101,7\n2,limit,12,sell,101,4\n3,limit,13,sell,102,5\n4,market,21,buy,0,9');
const t=replay(fifo),z=t.at(-1);assert.deepEqual(z.outcome.fills,[{maker:11,taker:21,price:101,quantity:7},{maker:12,taker:21,price:101,quantity:2}]);assert.equal(z.book.ask.price,101);assert.equal(z.book.ask.quantity,2);
const gap=replay(parseCSV('1,limit,1,buy,99,7\n3,limit,2,sell,100,1'));
assert.equal(gap.at(-1).outcome.reason,'SEQ_GAP');assert.equal(gap.at(-1).book.seq,1);
assert.throws(()=>parseCSV('1,limit,1,buy,not-an-int,3'),/invalid integer/);
assert.throws(()=>parseCSV('1,unknown,1,buy,100,2'),/unknown/);
const book=new Engine();
assert.equal(book.apply({seq:1,kind:'limit',id:1,side:'buy',price:100,qty:4}).accepted,true);
assert.equal(book.apply({seq:2,kind:'limit',id:1,side:'buy',price:101,qty:4}).reason,'DUPLICATE_ACTIVE_ID');
assert.equal(book.apply({seq:3,kind:'limit',id:2,side:'buy',price:101,qty:0}).reason,'INVALID_QUANTITY');
assert.equal(book.apply({seq:4,kind:'cancel',id:1,side:'buy',price:0,qty:0}).accepted,true);
assert.equal(book.snapshot().active,0);
// Deterministic property tests: each random event retains every book invariant.
for(let seed=1;seed<=12;seed++){
 let x=seed>>>0;const rand=()=>((x=Math.imul(x,1664525)+1013904223>>>0)>>>0);
 const b=new Engine();for(let i=1;i<=350;i++){
  const side=rand()%2?'buy':'sell';const kind=(i%5===0)?'cancel':(i%7===0)?'market':'limit';
  b.apply({seq:i,kind,id:kind==='cancel'?1+rand()%250:100000+i,side,price:95+rand()%11,qty:1+rand()%40});
  assert.ok(b.invariant(),`seed=${seed} event=${i}`);
 }
}
console.log('PASS: cross-language fixture checksum, FIFO, partial fills, cancel, gap, parser validation, 4200 randomized invariant checks');