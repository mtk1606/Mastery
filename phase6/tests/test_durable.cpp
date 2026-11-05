#include "durable.hpp"
#ifdef NDEBUG
#undef NDEBUG
#endif
#include <cassert>
#include <cstdio>
#include <filesystem>
#include <iostream>
#include <sys/wait.h>
#include <unistd.h>
#include <fcntl.h>
using namespace mastery::phase6;
namespace fs=std::filesystem;
static Request order(std::string client,std::string key,std::string sym,Id id,Side side,Price price,Qty qty){
 return {std::move(client),std::move(key),std::move(sym),Kind::Limit,id,side,price,qty};
}
static std::string tmp_dir(){char name[]="/tmp/mastery_phase6_XXXXXX";auto p=::mkdtemp(name);assert(p);return p;}
int main(){
 const std::string dir=tmp_dir(),path=dir+"/orders.wal";
 std::string canonical;
 {
  Journal db(path,{"AAPL","MSFT"});
  auto a=order("alpha","o1","AAPL",1,Side::Sell,101,5);
  auto x=db.submit(a);assert(x.status=="COMMITTED"&&x.response.accepted&&x.sequence==1);
  auto dup=db.submit(a);assert(dup.status=="IDEMPOTENT_REPLAY"&&dup.sequence==1&&db.venue().sequence()==1);
  auto conflict=a;conflict.quantity=6;
  assert(db.submit(conflict).status=="KEY_CONFLICT"&&db.venue().sequence()==1);
  auto b=order("alpha","o2","MSFT",2,Side::Buy,204,4);
  assert(db.submit(b).sequence==2);
  auto bad=order("alpha","fail","NOPE",3,Side::Buy,120,1);
  auto reject=db.submit(bad);assert(reject.sequence==3&&!reject.response.accepted&&reject.response.reason=="UNKNOWN_SYMBOL");
  assert(db.submit(bad).status=="IDEMPOTENT_REPLAY");
  assert(db.promote(2));assert(!db.promote(2));
  canonical=db.venue().canonical();assert(db.receipt_count()==3);
  // Single-writer lock protects the journal against concurrent handles.
  bool locked=false;try{Journal other(path,{"AAPL","MSFT"});}catch(std::runtime_error const&){locked=true;}
  assert(locked);
 }
 {
  Journal db(path,{"AAPL","MSFT"});
  assert(db.venue().epoch()==2&&db.venue().sequence()==3);
  assert(db.venue().canonical()==canonical&&db.restored_records()==4&&db.receipt_count()==3);
  assert(db.submit(order("alpha","o1","AAPL",1,Side::Sell,101,5)).status=="IDEMPOTENT_REPLAY");
 }
 // Crash after durable append and before applying to memory. Recover both state and receipt.
 pid_t pid=::fork();assert(pid>=0);
 if(pid==0){
  try{
   Journal child(path,{"AAPL","MSFT"});
   child.inject_crash_after_sync_once();
   child.submit(order("alpha","crash","AAPL",4,Side::Buy,101,2));
   ::_exit(7); // Unexpected success.
  }catch(std::runtime_error const&){::_exit(91);}
  ::_exit(8);
 }
 int status=0;assert(::waitpid(pid,&status,0)==pid&&WIFEXITED(status)&&WEXITSTATUS(status)==91);
 std::string after_crash;
 {
  Journal db(path,{"AAPL","MSFT"});
  assert(db.venue().sequence()==4&&db.receipt_count()==4&&db.venue().invariant());
  assert(db.submit(order("alpha","crash","AAPL",4,Side::Buy,101,2)).status=="IDEMPOTENT_REPLAY");
  assert(db.venue().book("AAPL").resting_count()==1);
  after_crash=db.venue().canonical();
 }
 // Partial, UNTERMINATED WAL record: fail safe by truncating only the torn suffix.
 {
  int fd=::open(path.c_str(),O_WRONLY|O_APPEND);assert(fd>=0);
  const std::string fragment="E 2 5 incomplete";
  assert(::write(fd,fragment.data(),fragment.size())==static_cast<ssize_t>(fragment.size()));
  assert(::fsync(fd)==0);::close(fd);
  Journal recovered(path,{"AAPL","MSFT"});
  assert(recovered.discarded_torn_bytes()==fragment.size());
  assert(recovered.venue().canonical()==after_crash);
  assert(recovered.submit(order("alpha","final","MSFT",5,Side::Sell,206,2)).sequence==5);
 }
 // An invalid but NEWLINE-TERMINATED record must NOT be silently skipped.
 {
  std::string badpath=dir+"/corrupt.wal";
  {Journal j(badpath,{"AAPL"});j.submit(order("beta","k","AAPL",1,Side::Sell,101,1));}
  int fd=::open(badpath.c_str(),O_RDWR);assert(fd>=0);
  char flip='X';assert(::pwrite(fd,&flip,1,5)==1);assert(::fsync(fd)==0);::close(fd);
  bool rejected=false;try{Journal broken(badpath,{"AAPL"});}catch(std::invalid_argument const&){rejected=true;}
  assert(rejected);
 }
 // A missing event must not be acknowledged. Business rejections ARE WAL records.
 {
  Journal db(path,{"AAPL","MSFT"});
  auto res=db.submit(order("alice","new","AAPL",6,Side::Buy,100,1));
  assert(res.sequence==6&&db.venue().invariant());
  assert(db.venue().sequence()==6);
 }
 // Independent bounded readers: slow client misses history; fast client still advances.
 {
  RetainedFeed feed(3);assert(feed.attach("fast",0));assert(feed.attach("slow",0));
  assert(feed.publish(1,"A")=="PUBLISHED");assert(feed.publish(2,"B")=="PUBLISHED");
  assert(feed.poll("fast").status=="EVENT");assert(feed.poll("fast").status=="EVENT");
  assert(feed.publish(3,"C")=="PUBLISHED");assert(feed.publish(4,"D")=="PUBLISHED");
  assert(feed.oldest()==2&&feed.retained()==3);
  assert(feed.poll("fast").seq==3&&feed.poll("fast").seq==4);
  assert(feed.poll("slow").status=="GAP_NEEDS_SNAPSHOT");
  assert(feed.publish(5,"E")=="PUBLISHED");assert(feed.poll("fast").seq==5);
  assert(!feed.resnapshot("slow",4));assert(feed.resnapshot("slow",5));
  assert(feed.poll("slow").status=="NO_NEW_EVENTS");
  assert(feed.publish(5,"dup")=="GAP_OR_DUPLICATE");
  assert(feed.publish(7,"gap")=="GAP_OR_DUPLICATE");
  assert(feed.publish(6,"F")=="PUBLISHED");
  assert(feed.poll("slow").seq==6);
  assert(feed.poll("missing").status=="UNKNOWN_SUBSCRIBER");
 }
 // Seeded sessions replay exactly, including duplicate idempotency retries.
 {
  auto randompath=dir+"/random.wal";
  std::uint64_t seed=0xA17D35ULL;
  auto rng=[&](){seed^=seed<<13;seed^=seed>>7;seed^=seed<<17;return seed;};
  std::vector<Request> events;events.reserve(600);
  for(int i=0;i<600;i++){
   auto v=rng();
   events.push_back(order("load", "r"+std::to_string(i), (v%2)?"AAPL":"MSFT", 1000+i,
      (v%4)?Side::Buy:Side::Sell, 100+static_cast<Price>(v%10),1+static_cast<Qty>(v%3)));
  }
  std::string expected;
  {Journal j(randompath,{"AAPL","MSFT"});
   for(int i=0;i<600;i++){auto r=j.submit(events[i]);assert(r.sequence==static_cast<std::uint64_t>(i+1));
    if(i%47==0)assert(j.submit(events[i]).status=="IDEMPOTENT_REPLAY");}
   expected=j.venue().canonical();
  }
  {Journal j(randompath,{"AAPL","MSFT"});assert(j.venue().canonical()==expected);
   assert(j.receipt_count()==600&&j.venue().sequence()==600&&j.venue().invariant());}
 }
 fs::remove_all(dir);
 std::cout<<"PHASE_VI_NATIVE_PASS: WAL fsync crash recovery, durable idempotency, conflict, torn-tail, fail-closed corruption, epoch and 600 seeded records, isolated stream gap/resnapshot\n";
}