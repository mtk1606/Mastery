#include "segmented.hpp"
#ifdef NDEBUG
#undef NDEBUG
#endif
#include <cassert>
#include <chrono>
#include <fstream>
#include <iostream>
#include <random>
#include <sys/wait.h>
using namespace mastery::phase7;
static fs::path base(){return fs::temp_directory_path()/("mastery7-"+std::to_string(::getpid())+"-"+std::to_string(std::chrono::steady_clock::now().time_since_epoch().count()));}
static void append_bytes(fs::path p,std::string s){std::ofstream f(p,std::ios::app|std::ios::binary);assert(f);f<<s;}
int main(){
 const auto root=base();fs::create_directories(root);std::size_t tests=0;
 {SegmentedLog x(root,256);assert(x.sequence()==0);auto a=x.submit("c","r1","book","bid");assert(a.seq==1&&!a.replayed);assert(x.submit("c","r1","book","bid").replayed);assert(x.sequence()==1);++tests;
  try{x.submit("c","r1","book","ask");assert(false);}catch(std::invalid_argument const&){}++tests;
  try{SegmentedLog other(root,256);assert(false);}catch(std::runtime_error const&){}++tests;
  for(int i=2;i<=160;i++){auto v=x.submit("c", "r"+std::to_string(i),"key"+std::to_string(i%19),"v"+std::to_string(i));assert(v.seq==static_cast<std::uint64_t>(i));}
  assert(x.segment_count()>2);++tests;
  x.compact();assert(x.checkpoint_sequence()==160);assert(x.segment_count()==1);++tests;
  assert(x.submit("c","r1","book","bid").replayed);assert(x.sequence()==160);++tests;
  x.submit("c","r161","book","ask");assert(x.state().at("book")=="ask");++tests;
 }
 {SegmentedLog x(root,256);assert(x.sequence()==161);assert(x.receipt_count()==161);assert(x.state().at("book")=="ask");assert(x.submit("c","r1","book","bid").replayed);++tests;}
 // Fully synced record followed by simulated process death, without in-memory application.
 pid_t pid=::fork();assert(pid>=0);
 if(pid==0){SegmentedLog x(root,256);x.inject_after_sync();try{x.submit("crashed","once","order","live");}catch(...){::_exit(83);}::_exit(84);}
 int status=0;assert(::waitpid(pid,&status,0)==pid&&WIFEXITED(status)&&WEXITSTATUS(status)==83);++tests;
 {SegmentedLog x(root,256);assert(x.sequence()==162);assert(x.state().at("order")=="live");auto a=x.submit("crashed","once","order","live");assert(a.seq==162&&a.replayed);++tests;
  x.inject_before_snapshot_rename();try{x.compact();assert(false);}catch(std::runtime_error const&){}
  assert(x.sequence()==162);++tests;
 }
 {SegmentedLog x(root,256);assert(x.sequence()==162);assert(x.state().at("order")=="live");x.compact();assert(x.segment_count()==1);++tests;}
 // Incomplete final record is allowed to truncate (no acknowledgement of that record).
 {auto segs=fs::directory_iterator(root);for(auto const& ent:segs)if(ent.path().extension()==".wal")append_bytes(ent.path(),"R 163 torn");}
 {SegmentedLog x(root,256);assert(x.sequence()==162);assert(x.torn_bytes()==10);++tests;}
 // Complete corrupted record must fail closed instead of silently skipping.
 const auto bad=base();fs::create_directories(bad);
 {SegmentedLog x(bad,256);x.submit("alice","tok1","key","value");}
 for(auto const& ent:fs::directory_iterator(bad))if(ent.path().extension()==".wal"){
  std::fstream f(ent.path(),std::ios::in|std::ios::out|std::ios::binary);f.seekp(7);f.put('X');}
 try{SegmentedLog x(bad,256);assert(false);}catch(std::invalid_argument const&){}++tests;
 // Checkpoint corruption must abort rather than inventing state.
 const auto corruptSnap=base();fs::create_directories(corruptSnap);
 {SegmentedLog x(corruptSnap,256);x.submit("bob","abc","balance","stable");x.compact();}
 {auto snap=corruptSnap/"snapshot.dat";std::fstream f(snap,std::ios::in|std::ios::out|std::ios::binary);f.seekp(12);f.put('X');}
 try{SegmentedLog x(corruptSnap,256);assert(false);}catch(std::invalid_argument const&){}++tests;
 // Deterministic state comparison across restarts/compactions.
 auto randomDir=base();fs::create_directories(randomDir);std::map<std::string,std::string> expected;std::mt19937 rng(90210);
 {SegmentedLog x(randomDir,384);for(int i=1;i<=3000;i++){
    const int k=static_cast<int>(rng()%37);auto key="key"+std::to_string(k),value="value"+std::to_string(i);
    auto r=x.submit("seed","txn"+std::to_string(i),key,value);assert(r.seq==static_cast<std::uint64_t>(i));expected[key]=value;
    if(i%201==0)x.compact();
    if(i%89==0)assert(x.state()==expected);
  }assert(x.state()==expected);++tests;}
 {SegmentedLog x(randomDir,384);assert(x.sequence()==3000);assert(x.receipt_count()==3000);assert(x.state()==expected);assert(x.sequence()==3000);++tests;}
 fs::remove_all(root);fs::remove_all(bad);fs::remove_all(randomDir);fs::remove_all(corruptSnap);
 std::cout<<"PHASE7 PASS "<<tests<<" targeted checks plus 3000 seeded transactions\n";
}