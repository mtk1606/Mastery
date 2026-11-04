#include "exchange.hpp"
#include <fstream>
#include <iostream>
#include <charconv>
#include <array>
#include <string_view>
#include <vector>
#include <iomanip>
using namespace mastery::exchange;

template<class T> T value(std::string_view s) {
    T out{};
    const auto [p,ec]=std::from_chars(s.data(),s.data()+s.size(),out);
    if(ec!=std::errc{}||p!=s.data()+s.size())throw std::invalid_argument("Invalid integer in feed");
    return out;
}
static Event parse(std::string_view row) {
    std::array<std::string_view,6> columns{};
    for(size_t i=0;i<5;i++){
        const auto comma=row.find(',');
        if(comma==std::string_view::npos)throw std::invalid_argument("CSV requires six fields");
        columns[i]=row.substr(0,comma);row.remove_prefix(comma+1);
    }
    columns[5]=row;
    if(columns[5].find(',')!=std::string_view::npos)throw std::invalid_argument("Too many CSV fields");
    Event e{};
    e.seq=value<std::uint64_t>(columns[0]);
    if(columns[1]=="limit")e.kind=Kind::Limit;
    else if(columns[1]=="market")e.kind=Kind::Market;
    else if(columns[1]=="cancel")e.kind=Kind::Cancel;
    else throw std::invalid_argument("Unknown event kind");
    e.id=value<Id>(columns[2]);
    if(columns[3]=="buy")e.side=Side::Buy;
    else if(columns[3]=="sell")e.side=Side::Sell;
    else throw std::invalid_argument("Unknown side");
    e.price=value<Price>(columns[4]);
    const auto qty64=value<std::uint64_t>(columns[5]);
    if(qty64>UINT32_MAX)throw std::invalid_argument("Quantity exceeds uint32");
    e.quantity=static_cast<Qty>(qty64);
    return e;
}
int main(int argc,char** argv){
    if(argc<2||argc>3){std::cerr<<"Usage: mastery_replay <events.csv> [--trace]\n";return 2;}
    const bool trace=argc==3&&std::string_view(argv[2])=="--trace";
    if(argc==3&&!trace){std::cerr<<"Unknown option\n";return 2;}
    std::ifstream file(argv[1]);if(!file){std::cerr<<"Cannot open feed\n";return 2;}
    Exchange engine;std::string line;
    std::uint64_t total=0,accepted=0,rejected=0,executions=0;
    try{
        while(std::getline(file,line)){
            if(line.empty()||line[0]=='#'||line.rfind("seq,",0)==0)continue;
            const Event ev=parse(line);
            auto out=engine.process(ev);
            ++total;accepted+=out.accepted;rejected+=!out.accepted;executions+=out.fills.size();
            if(trace){std::cout<<"seq="<<ev.seq<<" id="<<ev.id<<" result="<<out.reason<<" fills="<<out.fills.size()<<" state="<<engine.canonical()<<"\n";}
            if(!engine.invariant())throw std::logic_error("Order-book invariant violated");
            if(out.reason=="SEQ_GAP")throw std::logic_error("Sequence gap detected");
        }
        auto quote=[](std::optional<Quote> x){return x?std::to_string(x->price):"null";};
        std::cout<<"{\"events\":"<<total<<",\"accepted\":"<<accepted<<",\"rejected\":"<<rejected
          <<",\"fills\":"<<executions<<",\"active\":"<<engine.resting_count()
          <<",\"bestBid\":"<<quote(engine.best_bid())<<",\"bestAsk\":"<<quote(engine.best_ask())
          <<",\"fnv1a64\":\""<<engine.state_hash()<<"\"}\n";
        return 0;
    }catch(std::exception const& e){std::cerr<<"Replay failed at line "<<(total+1)<<": "<<e.what()<<"\n";return 1;}
}