#pragma once
// Mastery Phase VI — educational, Linux/POSIX-only, single-process WAL.
// A successful request is acknowledged only after fsync of a complete record.
// This is not a production-grade storage engine or a replacement for consensus.
#include "../../phase5/include/reliability.hpp"
#include <algorithm>
#include <cerrno>
#include <charconv>
#include <cstdint>
#include <cstring>
#include <deque>
#include <fcntl.h>
#include <filesystem>
#include <iomanip>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <string_view>
#include <sys/file.h>
#include <sys/stat.h>
#include <unistd.h>
#include <utility>
#include <vector>

namespace mastery::phase6 {
using namespace mastery::phase5;
namespace fs=std::filesystem;
inline bool ascii_token(std::string_view token, std::size_t max_size) {
    if(token.empty() || token.size()>max_size) return false;
    for(unsigned char c:token) if(!((c>='A'&&c<='Z')||(c>='a'&&c<='z')||
         (c>='0'&&c<='9')||c=='-'||c=='_')) return false;
    return true;
}
inline std::string hex64(std::uint64_t h) {
    std::ostringstream out;out<<std::hex<<std::setfill('0')<<std::setw(16)<<h;return out.str();
}
struct Request {
    std::string client, key, symbol;
    Kind kind{Kind::Limit}; Id id{}; Side side{Side::Buy}; Price price{}; Qty quantity{};
};
inline int kind_code(Kind k) {return k==Kind::Limit?0:k==Kind::Market?1:2;}
inline int side_code(Side s){return s==Side::Buy?0:1;}
inline std::string signature(Request const& c){
    std::ostringstream s;
    s<<c.symbol<<' '<<kind_code(c.kind)<<' '<<c.id<<' '<<side_code(c.side)<<' '<<c.price<<' '<<c.quantity;
    return s.str();
}
struct Receipt {
    Reply response;
    std::uint64_t sequence{}, state_hash{};
    std::string status;
};
inline std::string record_event(std::uint64_t epoch,std::uint64_t seq,Request const& c,std::uint64_t hash){
    std::ostringstream s;
    s<<"E "<<epoch<<' '<<seq<<' '<<c.client<<' '<<c.key<<' '<<signature(c)<<' '<<hash;
    return s.str();
}
inline std::string record_promotion(std::uint64_t epoch,std::uint64_t hash){
    return "P "+std::to_string(epoch)+" "+std::to_string(hash);
}
inline std::string encode_line(std::string const& payload){return payload+'\t'+hex64(fingerprint(payload))+'\n';}
class Journal {
    int fd_{-1};
    std::vector<std::string> symbols_;
    Venue venue_;
    std::map<std::pair<std::string,std::string>, std::pair<std::string,Receipt>> receipts_;
    bool poisoned_{false}, inject_after_sync_{false};
    std::size_t recovery_count_{0}, torn_tail_bytes_{0};
    static constexpr std::size_t MAX_LOG=16*1024*1024;
    static void io_fail(char const* action){throw std::runtime_error(std::string(action)+": "+std::strerror(errno));}
    static void check_request(Request const& r){
        if(!ascii_token(r.client,24)||!ascii_token(r.key,32)||!symbol_valid(r.symbol))
            throw std::invalid_argument("invalid client, idempotency key, or symbol syntax");
        // Inputs have a canonical byte encoding. Reject enum values outside this representation.
        if((r.kind!=Kind::Limit&&r.kind!=Kind::Market&&r.kind!=Kind::Cancel)||
            (r.side!=Side::Buy&&r.side!=Side::Sell))throw std::invalid_argument("invalid enum");
    }
    static std::pair<std::string,std::string> identity(Request const& r){return {r.client,r.key};}
    static Request parse_request(std::istringstream& in){
        Request r;int kind=-1,side=-1;std::uint64_t qty=UINT64_MAX;
        if(!(in>>r.client>>r.key>>r.symbol>>kind>>r.id>>side>>r.price>>qty)||kind<0||kind>2||side<0||side>1||qty>UINT32_MAX)
            throw std::invalid_argument("invalid WAL event fields");
        r.kind=static_cast<Kind>(kind);r.side=static_cast<Side>(side);r.quantity=static_cast<Qty>(qty);
        check_request(r);return r;
    }
    void replay_line(std::string const& line){
        auto sep=line.rfind('\t');
        if(sep==std::string::npos||line.substr(sep+1)!=hex64(fingerprint(std::string_view(line).substr(0,sep))))
            throw std::invalid_argument("complete WAL record has invalid checksum");
        std::string payload=line.substr(0,sep),kind;std::istringstream in(payload);
        if(!(in>>kind))throw std::invalid_argument("empty WAL payload");
        std::string extra;
        if(kind=="P"){
            std::uint64_t epoch{},hash{};
            if(!(in>>epoch>>hash)||(in>>extra)||payload!=record_promotion(epoch,hash)||epoch<=venue_.epoch())
                throw std::invalid_argument("invalid promotion record");
            if(!venue_.promote(epoch)||venue_.state_hash()!=hash)throw std::invalid_argument("promotion hash mismatch");
        }else if(kind=="E"){
            std::uint64_t epoch{},seq{},expected{};
            if(!(in>>epoch>>seq))throw std::invalid_argument("missing event sequence");
            Request r=parse_request(in);
            if(!(in>>expected)||(in>>extra)||payload!=record_event(epoch,seq,r,expected)||
                epoch!=venue_.epoch()||venue_.sequence()==UINT64_MAX||seq!=venue_.sequence()+1||
                receipts_.contains(identity(r)))throw std::invalid_argument("noncanonical, repeated or gapped WAL event");
            auto reply=venue_.apply(Input{epoch,seq,r.symbol,r.kind,r.id,r.side,r.price,r.quantity});
            if(venue_.state_hash()!=expected||!venue_.invariant())throw std::invalid_argument("WAL replay diverged from recorded state");
            receipts_.emplace(identity(r),std::make_pair(signature(r),Receipt{reply,seq,expected,"COMMITTED"}));
        }else throw std::invalid_argument("unknown WAL record type");
        ++recovery_count_;
    }
    void recover(){
        struct stat st{};if(::fstat(fd_,&st)<0)io_fail("fstat");
        if(st.st_size<0||static_cast<std::uint64_t>(st.st_size)>MAX_LOG)throw std::invalid_argument("WAL exceeds classroom bound");
        std::string bytes(static_cast<std::size_t>(st.st_size),'\0');
        std::size_t offset=0;
        while(offset<bytes.size()){
            ssize_t n=::pread(fd_,bytes.data()+offset,bytes.size()-offset,static_cast<off_t>(offset));
            if(n<0&&errno==EINTR)continue;
            if(n<=0)io_fail("pread WAL");
            offset+=static_cast<std::size_t>(n);
        }
        std::size_t start=0;
        while(start<bytes.size()){
            const auto end=bytes.find('\n',start);
            if(end==std::string::npos){
                // Only a record WITHOUT a newline is treated as torn and discarded.
                torn_tail_bytes_=bytes.size()-start;
                if(::ftruncate(fd_,static_cast<off_t>(start))<0||::fsync(fd_)<0)io_fail("truncate torn WAL tail");
                break;
            }
            replay_line(bytes.substr(start,end-start)); // Complete corruption is fail-closed.
            start=end+1;
        }
        if(::lseek(fd_,0,SEEK_END)<0)io_fail("seek WAL");
    }
    void append(std::string const& payload){
        if(poisoned_)throw std::logic_error("journal must be reopened after uncertain commit");
        const std::string line=encode_line(payload);
        off_t start=::lseek(fd_,0,SEEK_END);
        if(start<0)io_fail("seek WAL end");
        if(static_cast<std::uint64_t>(start)+line.size()>MAX_LOG)throw std::length_error("WAL full; no compaction in this module");
        std::size_t written=0;
        try{
            while(written<line.size()){
                ssize_t n=::write(fd_,line.data()+written,line.size()-written);
                if(n<0&&errno==EINTR)continue;
                if(n<=0)io_fail("append WAL");
                written+=static_cast<std::size_t>(n);
            }
            if(::fsync(fd_)<0)io_fail("fsync WAL");
        }catch(...){
            // Best effort rollback; *never* report success after an uncertain write.
            poisoned_=true;
            ::ftruncate(fd_,start);::fsync(fd_);
            throw;
        }
        if(inject_after_sync_){
            poisoned_=true;
            throw std::runtime_error("INJECTED_CRASH_AFTER_FSYNC_BEFORE_APPLY");
        }
    }
public:
    Journal(std::string path,std::vector<std::string> symbols)
       : symbols_(std::move(symbols)),venue_(symbols_){
        fd_=::open(path.c_str(),O_RDWR|O_CREAT|O_CLOEXEC,0600);
        if(fd_<0)io_fail("open WAL");
        try{
            if(::flock(fd_,LOCK_EX|LOCK_NB)<0)io_fail("lock WAL (single writer)");
            // Directory sync is necessary when creating the WAL name for the first time.
            fs::path parent=fs::path(path).parent_path();if(parent.empty())parent=".";
            int dfd=::open(parent.c_str(),O_RDONLY|O_DIRECTORY|O_CLOEXEC);
            if(dfd<0)io_fail("open WAL directory");
            if(::fsync(dfd)<0){int old=errno;::close(dfd);errno=old;io_fail("fsync WAL directory");}
            ::close(dfd);
            recover();
        }catch(...){::close(fd_);fd_=-1;throw;}
    }
    Journal(Journal const&)=delete;Journal& operator=(Journal const&)=delete;
    ~Journal(){if(fd_>=0)::close(fd_);}
    Venue const& venue()const{return venue_;}
    std::size_t restored_records()const{return recovery_count_;}
    std::size_t discarded_torn_bytes()const{return torn_tail_bytes_;}
    std::size_t receipt_count()const{return receipts_.size();}
    void inject_crash_after_sync_once(){inject_after_sync_=true;}
    Receipt submit(Request const& r){
        if(poisoned_)throw std::logic_error("journal poisoned");
        check_request(r);
        auto it=receipts_.find(identity(r));
        if(it!=receipts_.end()){
            if(it->second.first!=signature(r))return {Reply{false,"KEY_CONFLICT",{}},it->second.second.sequence,venue_.state_hash(),"KEY_CONFLICT"};
            Receipt old=it->second.second;old.status="IDEMPOTENT_REPLAY";return old;
        }
        if(venue_.sequence()==UINT64_MAX)throw std::overflow_error("global sequence exhausted");
        Venue candidate(symbols_);candidate.restore(venue_.checkpoint());
        std::uint64_t seq=venue_.sequence()+1;
        auto reply=candidate.apply(Input{candidate.epoch(),seq,r.symbol,r.kind,r.id,r.side,r.price,r.quantity});
        if(!candidate.invariant())throw std::logic_error("candidate invariant failed");
        auto hash=candidate.state_hash();
        append(record_event(venue_.epoch(),seq,r,hash));
        venue_=std::move(candidate);
        Receipt receipt{reply,seq,hash,"COMMITTED"};
        receipts_.emplace(identity(r),std::make_pair(signature(r),receipt));
        return receipt;
    }
    bool promote(std::uint64_t epoch){
        if(poisoned_)throw std::logic_error("journal poisoned");
        if(epoch<=venue_.epoch())return false;
        Venue candidate(symbols_);candidate.restore(venue_.checkpoint());if(!candidate.promote(epoch))return false;
        append(record_promotion(epoch,candidate.state_hash()));
        venue_=std::move(candidate);return true;
    }
};

struct FeedRecord {std::uint64_t seq;std::string summary;};
struct ReadResult {std::string status;std::uint64_t seq{};std::string summary;};
// Independent subscribers can fall behind; publisher never waits for a reader.
// Retention is a hard memory bound, not an infinite replay guarantee.
class RetainedFeed {
    std::size_t capacity_;
    std::deque<FeedRecord> retained_;
    std::uint64_t latest_{};
    std::map<std::string,std::uint64_t> cursor_;
public:
    explicit RetainedFeed(std::size_t capacity,std::uint64_t initial=0):capacity_(capacity),latest_(initial){
        if(capacity==0||capacity>4096)throw std::invalid_argument("capacity out of bounds");
    }
    std::uint64_t latest()const{return latest_;}
    std::uint64_t oldest()const{return retained_.empty()?latest_+1:retained_.front().seq;}
    std::size_t retained()const{return retained_.size();}
    bool attach(std::string client,std::uint64_t snapshot_seq){
        if(!ascii_token(client,24)||snapshot_seq!=latest_)return false;
        return cursor_.emplace(std::move(client),snapshot_seq).second;
    }
    bool resnapshot(std::string const& client,std::uint64_t snapshot_seq){
        auto it=cursor_.find(client);
        if(it==cursor_.end()||snapshot_seq!=latest_)return false;
        it->second=snapshot_seq;return true;
    }
    std::string publish(std::uint64_t seq,std::string summary){
        if(latest_==UINT64_MAX||seq!=latest_+1)return "GAP_OR_DUPLICATE";
        if(summary.size()>120)return "SUMMARY_TOO_LARGE";
        retained_.push_back({seq,std::move(summary)});
        latest_=seq;
        if(retained_.size()>capacity_)retained_.pop_front();
        return "PUBLISHED";
    }
    ReadResult poll(std::string const& client){
        auto it=cursor_.find(client);if(it==cursor_.end())return {"UNKNOWN_SUBSCRIBER",0,{}};
        if(it->second==latest_)return {"NO_NEW_EVENTS",latest_,{}};
        if(it->second<oldest()-1)return {"GAP_NEEDS_SNAPSHOT",oldest(),{}};
        auto seq=it->second+1;
        if(retained_.empty()||seq<oldest()||seq>latest_)return {"GAP_NEEDS_SNAPSHOT",oldest(),{}};
        const auto& e=retained_[static_cast<std::size_t>(seq-oldest())];
        if(e.seq!=seq)throw std::logic_error("noncontiguous retained history");
        it->second=seq;return {"EVENT",seq,e.summary};
    }
};
} // namespace mastery::phase6