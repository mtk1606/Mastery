/* Mastery C++20 / Systems Laboratories — original instructional material. */
'use strict';
const CPP_LESSONS = [
{
 id:'two-sum', number:'01', unit:'DSA · ALGORITHMS', title:'Hashing, invariants, and integer safety', time:'25–40 min',
 question:'Return two distinct indices i and j whose values sum to target. Return an empty vector when no pair exists.',
 objective:'Derive an O(n) expected-time search from the loop invariant. Guard against signed arithmetic overflow.',
 contract:'std::vector<int> twoSum(const std::vector<int>& nums, int target)',
 glossary:[['Hash table','An associative container that indexes a key using a hash function. std::unordered_map offers average constant-time lookup, not a worst-case guarantee.'],['Invariant','A claim that is true initially and remains true after every iteration; here, the table holds only previous elements.'],['std::find / map.find','find looks up an element; comparing its iterator with end() tells whether the key exists, without inserting a new element.'],['long long','A signed integer type that can safely represent the difference of any two 32-bit int values on common C++20 targets; cast before subtraction.']],
 strategy:['Before processing position i, the table represents positions 0 through i−1.','Compute target − nums[i] using a wider integer, then search the table.','Return the earlier index and i if found; otherwise remember nums[i] and continue.','Prove correctness by choosing the later index of any valid pair.'],
 edge:'[3,3], target 6 needs two different indices. target − nums[i] can overflow int when values are near INT_MIN / INT_MAX.',
 starter:`std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    // Before i, seen maps each earlier value to an index.
    // TODO: search the complement before inserting nums[i].
    return {};
}`,
 reference:`std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<long long, int> seen;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        const long long need = static_cast<long long>(target) - nums[i];
        auto it = seen.find(need);
        if (it != seen.end()) return {it->second, i};
        seen.emplace(static_cast<long long>(nums[i]), i);
    }
    return {};
}`,
 tests:[
 ['simple pair','checkTwoSum({2,7,11,15},9,{0,1})'],
 ['same-value pair','checkTwoSum({3,3},6,{0,1})'],
 ['indices not values','checkTwoSum({3,2,4},6,{1,2})'],
 ['no solution','checkTwoSum({1,2,3},100,{})'],
 ['negative values','checkTwoSum({-5,9,3,8},4,{0,1})'],
 ['repeated values','checkTwoSum({5,5,5},10,{0,1})'],
 ['empty input','checkTwoSum({},8,{})'],
 ['zero complement','checkTwoSum({0,4,3,0},0,{0,3})'],
 ['integer boundary','checkTwoSum({INT_MIN,0,INT_MAX},-1,{0,2})']
 ],
 helper:`bool checkTwoSum(std::vector<int> values, int target, std::vector<int> expected) {
    auto out = twoSum(values, target);
    if (expected.empty()) return out.empty();
    if (out.size() != 2 || out[0] == out[1]) return false;
    if (out[0] < 0 || out[1] < 0 || static_cast<size_t>(out[0]) >= values.size() || static_cast<size_t>(out[1]) >= values.size()) return false;
    return (static_cast<long long>(values[out[0]]) + values[out[1]] == target);
}`,
 discussion:'Why is the proof based on the later index? What changes if a hash table has adversarial collisions? Could a sorted two-pointer solution reduce auxiliary memory?',
 visualize:'hash'
},
{
 id:'linked-list',number:'02',unit:'DATA STRUCTURES · MEMORY',title:'Reverse a linked list without losing nodes',time:'35–55 min',
 question:'Reverse a singly linked list in-place. Return the new head, preserve each original node object, and terminate the tail with nullptr.',
 objective:'Understand pointer identity, ownership, and the three-pointer reversal invariant, not merely the final values.',
 contract:'Node* reverseList(Node* head)',
 glossary:[['Node','A separately allocated object with a value and a pointer to the next object. Nodes need not be adjacent in memory.'],['Pointer','A typed value that can refer to an object or be null. `Node*` points to a Node; `p->next` accesses a member through it.'],['nullptr','The distinguished C++ null pointer literal. An empty list is represented by a null head.'],['std::unique_ptr','An owning smart pointer that destroys an object when ownership ends. The algorithm must rearrange non-owning next pointers without allocating new nodes.'],['Dangling pointer','A pointer to an object whose lifetime has ended; dereferencing it is undefined behaviour.']],
 strategy:['Maintain prev as the head of the already-reversed prefix and curr as the next unreversed node.','Save next = curr->next before overwriting the link.','Set curr->next = prev, then advance prev and curr.','Invariant: every original node belongs to exactly one of the reversed prefix or untouched suffix.'],
 edge:'An empty list returns nullptr. A single node must point to nullptr. Forgetting next before rewiring loses the rest of the list.',
 starter:`Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    // TODO: save the next node, reverse one edge, advance.
    return head;
}`,
 reference:`Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
 prelude:'struct Node { int value; Node* next = nullptr; };',
 tests:[
 ['empty list','checkReverse({})'],['one node','checkReverse({9})'],['three nodes','checkReverse({1,2,3})'],['duplicate values','checkReverse({7,7,2})'],['five nodes','checkReverse({5,4,3,2,1})'],['zero and negatives','checkReverse({-2,0,-2,10})'],['ten nodes','checkReverse({1,2,3,4,5,6,7,8,9,10})']
 ],
 helper:`bool checkReverse(const std::vector<int>& data) {
    std::vector<std::unique_ptr<Node>> nodes;
    for (int v : data) nodes.push_back(std::make_unique<Node>(Node{v,nullptr}));
    for (size_t i=1; i<nodes.size(); ++i) nodes[i-1]->next = nodes[i].get();
    Node* original = nodes.empty() ? nullptr : nodes.front().get();
    Node* head = reverseList(original);
    Node* cur = head;
    for (size_t j=nodes.size(); j>0; --j) {
        if (cur != nodes[j-1].get()) return false; // pointer identity, not only values
        cur = cur->next;
    }
    return cur == nullptr;
}`,
 discussion:'Explain why a pointer-identity test is stronger than comparing only values. Why does O(1) additional storage not imply that nodes occupy O(1) total memory?',
 visualize:'list'
},
{
 id:'ring',number:'03',unit:'C++ SYSTEMS · BOUNDED QUEUES',title:'Circular queues, wraparound, and backpressure',time:'40–65 min',
 question:'Implement a fixed-capacity FIFO RingQueue of int values. push returns false when full; pop returns std::nullopt when empty.',
 objective:'Maintain the 0 ≤ count ≤ capacity invariant while head and tail move modulo capacity. Learn why bounded queues must define what happens under overload.',
 contract:'RingQueue(size_t); bool push(int); std::optional<int> pop(); size_t size() const',
 glossary:[['Ring buffer','A fixed-capacity array interpreted circularly. Head and tail indices wrap to zero after the last slot.'],['FIFO','First in, first out: the earliest successfully enqueued item leaves first.'],['std::optional<T>','An object that either stores a T or stores no value; std::nullopt expresses an empty pop.'],['Backpressure','Explicitly slowing, rejecting, or buffering producers when consumers cannot keep up.'],['SPSC','Single-producer, single-consumer. The browser demonstration is single-threaded; true concurrent atomics are exercised in the native project.']],
 strategy:['Allocate exactly capacity slots and define head as the next read position, tail as the next write position.','Reject push when count==capacity; reject pop when count==0.','After a successful operation, wrap the chosen index with (index + 1) % capacity.','Keep count consistent; explain why head==tail alone cannot tell full from empty.'],
 edge:'Capacity zero should reject all pushes without division by zero. Repeated wraparound must preserve FIFO after many cycles.',
 starter:`class RingQueue {
public:
    explicit RingQueue(size_t capacity) : slots_(capacity) {}
    bool push(int value) {
        // TODO: reject full, write at tail_, advance, increment count_.
        return false;
    }
    std::optional<int> pop() {
        // TODO: reject empty, read at head_, advance, decrement count_.
        return std::nullopt;
    }
    size_t size() const { return 0; }
private:
    std::vector<int> slots_;
    size_t head_ = 0, tail_ = 0, count_ = 0;
};`,
 reference:`class RingQueue {
public:
    explicit RingQueue(size_t capacity) : slots_(capacity) {}
    bool push(int value) {
        if (count_ == slots_.size()) return false;
        slots_[tail_] = value;
        tail_ = (tail_ + 1) % slots_.size();
        ++count_;
        return true;
    }
    std::optional<int> pop() {
        if (count_ == 0) return std::nullopt;
        int value = slots_[head_];
        head_ = (head_ + 1) % slots_.size();
        --count_;
        return value;
    }
    size_t size() const { return count_; }
private:
    std::vector<int> slots_;
    size_t head_ = 0, tail_ = 0, count_ = 0;
};`,
 tests:[
 ['empty pop','testRing(0)'],['capacity one','testRing(1)'],['full capacity','testRing(2)'],['wraparound','testRing(3)'],['long FIFO sequence','testRing(10)'],['zero capacity','testRing(99)']
 ],
 helper:`bool testRing(int variant) {
    if (variant == 0) { RingQueue q(4); return !q.pop().has_value() && q.size()==0; }
    if (variant == 1) { RingQueue q(1); if (!q.push(7) || q.push(8) || q.size()!=1) return false; auto x=q.pop(); return x && *x==7 && !q.pop() && q.size()==0; }
    if (variant == 2) { RingQueue q(2); return q.push(1) && q.push(2) && !q.push(3) && q.size()==2 && q.pop()==1 && q.pop()==2 && !q.pop(); }
    if (variant == 3) { RingQueue q(3); for(int v=1;v<=3;++v)if(!q.push(v))return false; if(q.pop()!=1 || q.pop()!=2)return false; if(!q.push(4) || !q.push(5))return false; return q.pop()==3 && q.pop()==4 && q.pop()==5 && !q.pop(); }
    if (variant == 10) { RingQueue q(7); for(int n=0;n<140;n+=7){for(int i=0;i<7;i++)if(!q.push(n+i))return false;for(int i=0;i<7;i++)if(q.pop()!=n+i)return false;}return q.size()==0; }
    if (variant == 99) { RingQueue q(0); return !q.push(1) && !q.pop() && q.size()==0; }
    return false;
}`,
 discussion:'Why does `head == tail` need a separate count (or a deliberately wasted slot)? For real SPSC concurrency, explain the happens-before relationship required to publish a written slot to the consumer.',
 visualize:'ring'
},
{
 id:'orderbook',number:'04',unit:'MARKET SYSTEMS · PRICE/TIME',title:'Order matching and deterministic event replay',time:'55–85 min',
 question:'Implement add and cancel operations for a limit order book. A marketable incoming order fills against the best opposite price, FIFO within a price level. Execute trades at the resting order price.',
 objective:'Prove priority, partial-fill accounting, and conservation of quantity. Separate the book model from real venue-specific matching rules.',
 contract:'Book::submit(Order) -> std::vector<Fill>; Book::cancel(int); bestBid()/bestAsk()',
 glossary:[['Limit order','An instruction to trade at a specified price or better; may rest if not immediately marketable.'],['Price-time priority','Better prices execute first; within a price level, earlier resting orders execute first. Actual venues may use different rules.'],['Partial fill','Execution of fewer units than the order requested; remaining quantity stays or continues matching.'],['Event replay','Reconstructing state by applying an ordered stream of add, execute and cancel events deterministically.'],['Tick','The smallest permitted price increment. Our exercise uses integer ticks to avoid floating-point price rounding.']],
 strategy:['Maintain two collections: bids sorted highest first and asks lowest first. Preserve arrival order within equal prices.','On submission, while the order crosses the opposite best quote, consume the oldest eligible resting order.','Report a Fill whose price equals the resting price; remove fully filled orders and keep partial quantities.','If quantity remains, append the incoming order to its side. On cancel, remove exactly the matching id.'],
 edge:'A buy limit at 101 must not cross an ask at 102. At the same price, adding B1 then B2 requires B1 to fill first. Integer quantity may never be negative.',
 prelude:`struct Order { int id; bool buy; int price; int qty; };
struct Fill { int restingId; int incomingId; int price; int qty; };`,
 starter:`class Book {
public:
    std::vector<Fill> submit(Order incoming) {
        // TODO: cross best prices; FIFO within a price level.
        return {};
    }
    bool cancel(int id) {
        // TODO: find and remove remaining resting quantity.
        return false;
    }
    int bestBid() const { return -1; }
    int bestAsk() const { return -1; }
private:
    std::list<Order> bids_, asks_;
};`,
 reference:`class Book {
public:
    std::vector<Fill> submit(Order o) {
        std::vector<Fill> out;
        if (o.qty <= 0 || o.price <= 0) return out;
        for (const auto& x : bids_) if (x.id == o.id) return out;
        for (const auto& x : asks_) if (x.id == o.id) return out;
        auto& opposite = o.buy ? asks_ : bids_;
        while (o.qty > 0 && !opposite.empty()) {
            auto it = opposite.begin();
            for (auto p=std::next(opposite.begin());p!=opposite.end();++p) {
                if (o.buy ? p->price < it->price : p->price > it->price) it=p;
            }
            if (o.buy ? it->price > o.price : it->price < o.price) break;
            int qty = std::min(o.qty, it->qty);
            out.push_back({it->id,o.id,it->price,qty});
            o.qty -= qty;
            it->qty -= qty;
            if (it->qty==0) opposite.erase(it);
        }
        if (o.qty > 0) (o.buy ? bids_ : asks_).push_back(o);
        return out;
    }
    bool cancel(int id) {
        for (auto* side : {&bids_, &asks_}) {
            for (auto it=side->begin();it!=side->end();++it) {
                if (it->id == id) { side->erase(it); return true; }
            }
        }
        return false;
    }
    int bestBid() const {int v=-1;for(const auto& x:bids_)v=std::max(v,x.price);return v;}
    int bestAsk() const {int v=-1;for(const auto& x:asks_)if(v<0||x.price<v)v=x.price;return v;}
private:
    std::list<Order> bids_,asks_;
};`,
 tests:[
 ['resting quote','testBook(1)'],['no crossing','testBook(2)'],['FIFO at equal price','testBook(3)'],['partial fill','testBook(4)'],['cancel by id','testBook(5)'],['best price priority','testBook(6)'],['remaining quantity','testBook(7)'],['invalid quantity','testBook(8)']
 ],
 helper:`bool testBook(int v) {
    Book b;
    if (v==1) { auto x=b.submit({1,true,100,4});return x.empty() && b.bestBid()==100 && b.bestAsk()==-1; }
    if (v==2) { b.submit({1,false,102,2}); auto x=b.submit({2,true,101,2});return x.empty() && b.bestBid()==101 && b.bestAsk()==102; }
    if (v==3) {b.submit({1,true,100,3});b.submit({2,true,100,2});auto x=b.submit({3,false,100,4});return x.size()==2 && x[0].restingId==1 && x[0].qty==3 && x[1].restingId==2 && x[1].qty==1 && x[0].price==100 && x[1].price==100;}
    if (v==4) {b.submit({1,false,105,5});auto x=b.submit({2,true,106,2});return x.size()==1 && x[0].qty==2 && x[0].price==105 && b.bestAsk()==105 && b.bestBid()==-1;}
    if (v==5) {b.submit({1,true,99,3});b.submit({2,true,100,4});bool r=b.cancel(2);return r && !b.cancel(2) && b.bestBid()==99;}
    if (v==6) {b.submit({1,true,99,2});b.submit({2,true,101,1});auto x=b.submit({3,false,98,2});return x.size()==2 && x[0].restingId==2 && x[0].price==101 && x[1].restingId==1 && x[1].price==99;}
    if (v==7) {b.submit({1,false,102,3});b.submit({2,true,102,5});return b.bestBid()==102 && b.bestAsk()==-1;}
    if (v==8) {auto x=b.submit({1,false,100,0});return x.empty() && b.bestAsk()==-1;}
    return false;
}`,
 discussion:'How would a real engine change to support cancel/replace, exchange timestamps, idempotency, sequence gaps, and recovery from an event log? Why is the reference list-based model intentionally not a low-latency implementation?',
 visualize:'book'
}
];
const CPP_PREAMBLE = `#include <algorithm>\n#include <climits>\n#include <cstddef>\n#include <cstdint>\n#include <iostream>\n#include <iterator>\n#include <list>\n#include <memory>\n#include <optional>\n#include <string>\n#include <unordered_map>\n#include <utility>\n#include <vector>\n`;
function cppBuildSource(lesson,body){
  const testStatements=lesson.tests.map(([name,expr],i)=>`check(${i+1}, ${expr});`).join('\n');
  return `${CPP_PREAMBLE}\n${lesson.prelude||''}\n${body}\n${lesson.helper}\nint main(){\nint passed=0;\nauto check=[&](int id, bool ok){std::cout << "MASTERY_TEST|" << id << "|" << (ok?"PASS":"FAIL") << "\\n";if(ok) ++passed;};\n${testStatements}\nstd::cout << "MASTERY_TOTAL|" << passed << "|" << ${lesson.tests.length} << "\\n";\nreturn passed==${lesson.tests.length}?0:1;\n}`;
}
if(typeof module!=='undefined')module.exports={CPP_LESSONS,CPP_PREAMBLE,cppBuildSource};