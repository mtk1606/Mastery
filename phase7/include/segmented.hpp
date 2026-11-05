#pragma once
// Mastery Phase VII: single-writer educational POSIX segmented WAL & compacted snapshot.
// Proof target: fsynced, complete records replay once within one process's crash model.
// NOT a replicated database, power-loss certification, or secure multi-tenant service.
#include <algorithm>
#include <cerrno>
#include <cstdint>
#include <cstring>
#include <filesystem>
#include <fcntl.h>
#include <fstream>
#include <iomanip>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <string_view>
#include <sys/file.h>
#include <sys/stat.h>
#include <unistd.h>
#include <vector>

namespace mastery::phase7 {
namespace fs=std::filesystem;
inline std::uint64_t fnv64(std::string_view s){std::uint64_t h=14695981039346656037ULL;for(unsigned char c:s){h^=c;h*=1099511628211ULL;}return h;}
inline std::string hex64(std::uint64_t x){std::ostringstream o;o<<std::hex<<std::setw(16)<<std::setfill('0')<<x;return o.str();}
inline bool token_ok(std::string_view s){if(s.empty()||s.size()>48)return false;for(unsigned char c:s)if(!((c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='_'||c=='-'))return false;return true;}
struct Ack {std::uint64_t seq{};std::string value;bool replayed{};};
struct Stored {std::string key,value;std::uint64_t seq{};};
class SegmentedLog {
    fs::path dir_;
    int lock_fd_{-1}, fd_{-1};
    std::uint64_t seq_{},snapshot_seq_{};
    std::size_t max_segment_{};
    std::map<std::string,std::string> values_;
    std::map<std::string,Stored> receipts_;
    fs::path active_path_;
    std::uint64_t active_start_{};
    bool poisoned_{false},inject_post_sync_{false},inject_snapshot_pre_rename_{false};
    std::size_t torn_bytes_{0};
    static void err(std::string_view what){throw std::runtime_error(std::string(what)+": "+std::strerror(errno));}
    static void all_write(int fd,std::string const& s){std::size_t o=0;while(o<s.size()){ssize_t n=::write(fd,s.data()+o,s.size()-o);if(n<0&&errno==EINTR)continue;if(n<=0)err("write");o+=static_cast<std::size_t>(n);}}
    static void sync_fd(int fd){if(::fsync(fd)!=0)err("fsync");}
    void sync_dir()const{int d=::open(dir_.c_str(),O_RDONLY|O_DIRECTORY|O_CLOEXEC);if(d<0)err("open directory");try{sync_fd(d);}catch(...){::close(d);throw;}::close(d);}
    static std::string read_file(fs::path const& p){std::ifstream in(p,std::ios::binary);if(!in)throw std::runtime_error("cannot read "+p.string());std::ostringstream b;b<<in.rdbuf();auto s=b.str();if(s.size()>8*1024*1024)throw std::invalid_argument("classroom file bound exceeded");return s;}
    static std::string payload(std::uint64_t seq,std::string const& client,std::string const& token,std::string const& key,std::string const& value){return "R "+std::to_string(seq)+" "+client+" "+token+" "+key+" "+value;}
    static std::string record(std::string const& p){return p+" "+hex64(fnv64(p))+"\n";}
    static std::uint64_t parsed_number(std::string const& s){if(s.empty()||s.size()>20)throw std::invalid_argument("invalid decimal");std::uint64_t n=0;for(char c:s){if(c<'0'||c>'9'||n>(UINT64_MAX-static_cast<unsigned>(c-'0'))/10)throw std::invalid_argument("bad decimal integer");n=n*10+static_cast<unsigned>(c-'0');}return n;}
    void apply_record(std::string const& line){
        auto split=line.rfind(' ');if(split==std::string::npos||line.size()-split!=17||line.substr(split+1)!=hex64(fnv64(std::string_view(line).substr(0,split))))throw std::invalid_argument("corrupt complete WAL record");
        std::istringstream in(line.substr(0,split));std::string op,ss,client,token,key,value,extra; if(!(in>>op>>ss>>client>>token>>key>>value)||(in>>extra)||op!="R"||!token_ok(client)||!token_ok(token)||!token_ok(key)||!token_ok(value))throw std::invalid_argument("invalid WAL payload");
        auto n=parsed_number(ss);
        if(n<=snapshot_seq_)return; // checkpoint already includes these entries
        if(seq_==UINT64_MAX||n!=seq_+1||receipts_.contains(client+":"+token))throw std::invalid_argument("noncontiguous or duplicate WAL transaction");
        seq_=n;values_[key]=value;receipts_.emplace(client+":"+token,Stored{key,value,n});
    }
    static std::vector<fs::path> segments(fs::path const& dir){
        std::vector<fs::path> p;
        for(auto const& x:fs::directory_iterator(dir))if(x.is_regular_file()){
            const auto n=x.path().filename().string();
            if(n.size()!=28||n.rfind("segment-",0)!=0||n.substr(24)!=".wal")continue;
            bool valid=true;for(int i=8;i<24;i++)if(n[i]<'0'||n[i]>'9')valid=false;
            if(valid)p.push_back(x.path());
        }
        std::sort(p.begin(),p.end());return p;
    }
    static std::string segment_name(std::uint64_t start){std::ostringstream o;o<<"segment-"<<std::setfill('0')<<std::setw(16)<<start<<".wal";return o.str();}
    void restore_snapshot(){
        auto file=dir_/"snapshot.dat";if(!fs::exists(file))return;
        auto s=read_file(file);const auto tail=s.rfind("C ");if(tail==std::string::npos||tail+19!=s.size()||s.back()!='\n'||s.substr(tail+2,16)!=hex64(fnv64(std::string_view(s).substr(0,tail))))throw std::invalid_argument("invalid snapshot checksum or framing");
        std::istringstream in(s.substr(0,tail));std::string header,version,number,extra;
        if(!(in>>header>>version>>number)||header!="M7SNAP"||version!="1")throw std::invalid_argument("unsupported snapshot");
        auto expected=parsed_number(number);std::string line;std::getline(in,line);
        std::map<std::string,Stored> ledger;std::map<std::string,std::string> values;std::uint64_t max_seq=0;
        while(std::getline(in,line)){
            if(line.empty())throw std::invalid_argument("empty snapshot row");
            std::istringstream row(line);std::string tag,client,token,key,value,nstr;
            if(!(row>>tag>>client>>token>>key>>value>>nstr)||(row>>extra)||tag!="R"||!token_ok(client)||!token_ok(token)||!token_ok(key)||!token_ok(value))throw std::invalid_argument("invalid snapshot record");
            auto seq=parsed_number(nstr);if(seq==0||seq>expected||!ledger.emplace(client+":"+token,Stored{key,value,seq}).second)throw std::invalid_argument("invalid receipt in snapshot");
            max_seq=std::max(max_seq,seq); // unique client:token receipts survive compaction
        }
        // Reconstruct current values IN TRANSACTION ORDER, not lexicographic client order.
        std::vector<std::pair<std::string,Stored>> ordered(ledger.begin(),ledger.end());
        std::sort(ordered.begin(),ordered.end(),[](auto const& a,auto const& b){return a.second.seq<b.second.seq;});
        for(auto const& x:ordered) values[x.second.key]=x.second.value;
        if(expected>0 && max_seq!=expected)throw std::invalid_argument("snapshot sequence does not match ledger");
        seq_=snapshot_seq_=expected;receipts_=std::move(ledger);values_=std::move(values);
    }
    void recover(){
        restore_snapshot();auto list=segments(dir_);
        for(std::size_t i=0;i<list.size();i++){
            auto s=read_file(list[i]);auto pos=std::size_t{0};
            while(pos<s.size()){
                const auto end=s.find('\n',pos);
                if(end==std::string::npos){
                    if(i+1<list.size())throw std::invalid_argument("torn non-terminal WAL segment");
                    torn_bytes_=s.size()-pos;int fd=::open(list[i].c_str(),O_RDWR|O_CLOEXEC);if(fd<0)err("open torn segment");
                    if(::ftruncate(fd,static_cast<off_t>(pos))<0||::fsync(fd)<0){::close(fd);err("trim torn WAL");}::close(fd);break;
                }
                apply_record(s.substr(pos,end-pos));pos=end+1;
            }
        }
        // Each restart starts a fresh numbered segment, preserving all old complete records.
        if(seq_==UINT64_MAX)throw std::overflow_error("sequence exhausted");
        open_segment(seq_+1);
    }
    void open_segment(std::uint64_t start){
        if(fd_>=0){::close(fd_);fd_=-1;}
        active_path_=dir_/segment_name(start);active_start_=start;
        fd_=::open(active_path_.c_str(),O_RDWR|O_CREAT|O_EXCL|O_CLOEXEC,0600);
        if(fd_<0){if(errno==EEXIST){ // empty segment may remain after a crash before appending
            fd_=::open(active_path_.c_str(),O_RDWR|O_APPEND|O_CLOEXEC);if(fd_<0)err("open existing segment");
            struct stat st{};if(::fstat(fd_,&st)<0||st.st_size>0)throw std::invalid_argument("next segment name collides with nonempty file");
        }else err("create segment");}
        sync_dir();
    }
public:
    SegmentedLog(fs::path dir,std::size_t segment_bytes=256):dir_(std::move(dir)),max_segment_(segment_bytes){
        if(segment_bytes<128||segment_bytes>1<<20)throw std::invalid_argument("segment size out of bounds");
        fs::create_directories(dir_);lock_fd_=::open((dir_/"LOCK").c_str(),O_CREAT|O_RDWR|O_CLOEXEC,0600);
        if(lock_fd_<0)err("create lock");
        try{if(::flock(lock_fd_,LOCK_EX|LOCK_NB)<0)err("lock single writer");sync_dir();recover();}
        catch(...){if(fd_>=0)::close(fd_);::close(lock_fd_);throw;}
    }
    SegmentedLog(SegmentedLog const&)=delete;SegmentedLog& operator=(SegmentedLog const&)=delete;
    ~SegmentedLog(){if(fd_>=0)::close(fd_);if(lock_fd_>=0)::close(lock_fd_);}
    std::uint64_t sequence()const{return seq_;}
    std::uint64_t checkpoint_sequence()const{return snapshot_seq_;}
    std::size_t receipt_count()const{return receipts_.size();}
    std::size_t torn_bytes()const{return torn_bytes_;}
    std::map<std::string,std::string> const& state()const{return values_;}
    std::size_t segment_count()const{return segments(dir_).size();}
    void inject_after_sync(){inject_post_sync_=true;}
    void inject_before_snapshot_rename(){inject_snapshot_pre_rename_=true;}
    Ack submit(std::string client,std::string request_id,std::string key,std::string value){
        if(poisoned_)throw std::logic_error("reopen after uncertain append");
        if(!token_ok(client)||!token_ok(request_id)||!token_ok(key)||!token_ok(value))throw std::invalid_argument("invalid canonical request");
        auto identity=client+":"+request_id;
        if(auto it=receipts_.find(identity);it!=receipts_.end()){
            if(it->second.key!=key||it->second.value!=value)throw std::invalid_argument("IDEMPOTENCY_CONFLICT");
            return {it->second.seq,it->second.value,true};
        }
        if(seq_==UINT64_MAX)throw std::overflow_error("WAL sequence exhausted");
        const auto n=seq_+1; const auto line=record(payload(n,client,request_id,key,value));
        if(line.size()>max_segment_)throw std::length_error("record exceeds one segment");
        struct stat st{};if(::fstat(fd_,&st)<0)err("fstat current segment");
        if(st.st_size>0&&static_cast<std::size_t>(st.st_size)+line.size()>max_segment_)open_segment(n);
        try{all_write(fd_,line);sync_fd(fd_);}catch(...){poisoned_=true;throw;}
        if(inject_post_sync_){poisoned_=true;throw std::runtime_error("INJECTED_CRASH_AFTER_SYNC");}
        receipts_[identity]={key,value,n};values_[key]=value;seq_=n;return {n,value,false};
    }
    void compact(){
        if(poisoned_)throw std::logic_error("reopen after uncertain commit");
        // All idempotency receipts retained in snapshot. True compaction needs bounded client history.
        std::ostringstream body;body<<"M7SNAP 1 "<<seq_<<'\n';
        for(auto const& [identity,row]:receipts_){auto colon=identity.find(':');
            body<<"R "<<identity.substr(0,colon)<<' '<<identity.substr(colon+1)<<' '<<row.key<<' '<<row.value<<' '<<row.seq<<'\n';}
        auto s=body.str();s+="C "+hex64(fnv64(s))+"\n";
        auto temp=dir_/"snapshot.tmp";int fd=::open(temp.c_str(),O_WRONLY|O_CREAT|O_TRUNC|O_CLOEXEC,0600);if(fd<0)err("open temp checkpoint");
        try{all_write(fd,s);sync_fd(fd);}catch(...){::close(fd);throw;}::close(fd);
        if(inject_snapshot_pre_rename_){inject_snapshot_pre_rename_=false;throw std::runtime_error("INJECTED_CRASH_BEFORE_RENAME");}
        if(::rename(temp.c_str(),(dir_/"snapshot.dat").c_str())<0)err("rename checkpoint");
        sync_dir();
        snapshot_seq_=seq_;
        open_segment(seq_+1); // directory sync before deleting older WAL segments
        for(auto const& f:segments(dir_))if(f!=active_path_){fs::remove(f);}
        sync_dir();
    }
};
} // namespace mastery::phase7