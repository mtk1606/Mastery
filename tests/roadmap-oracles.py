#!/usr/bin/env python3
"""Independent deterministic oracle verification of the Mastery JavaScript exercise bank."""
import collections
import json
import math
import sys


def sum_positive(values):
    return sum(value for value in values if value > 0)


def symbol_counts(events):
    return dict(collections.Counter(events))


def longest_unique(s):
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break
            seen.add(s[j])
            best = max(best, j - i + 1)
    return best


def binary_first(nums, target):
    for i, n in enumerate(nums):
        if n == target:
            return i
    return -1


def rolling_vwap(trades):
    amount = sum(price * qty for price, qty in trades)
    total = sum(qty for _, qty in trades)
    return round(amount / total, 4) if total else None


def dedup_events(events):
    seen, result = set(), []
    for event in events:
        if event[0] not in seen:
            seen.add(event[0])
            result.append(event)
    return result


def bfs(graph, start):
    q = collections.deque([start])
    d = {start: 0}
    while q:
        u = q.popleft()
        for v in graph.get(u, []):
            if v not in d:
                d[v] = d[u] + 1
                q.append(v)
    return d


def gradient_step(w, x, y, lr):
    return w - lr * (2 * x * (w*x-y))


def stable_sigmoid(x):
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    return math.exp(x) / (1.0 + math.exp(x))


def window_max_sum(values, k):
    if k <= 0 or k > len(values):
        return None
    return max(sum(values[i:i+k]) for i in range(len(values)-k+1))


def compare(actual, expected, numeric_mode='exact'):
    if isinstance(expected,(int,float)) and not isinstance(expected,bool) and numeric_mode=='float':
        return isinstance(actual,(float,int)) and not isinstance(actual,bool) and math.isfinite(actual) and math.isclose(actual,expected,rel_tol=1e-7,abs_tol=1e-8)
    if isinstance(expected, float):
        return isinstance(actual,(float,int)) and not isinstance(actual,bool) and math.isfinite(actual) and math.isclose(actual,expected,rel_tol=1e-7,abs_tol=1e-8)
    if isinstance(expected, list):
        return isinstance(actual,list) and len(actual)==len(expected) and all(compare(x,y) for x,y in zip(actual,expected))
    if isinstance(expected,dict):
        return isinstance(actual,dict) and actual.keys()==expected.keys() and all(compare(actual[k],v) for k,v in expected.items())
    return actual==expected and type(actual) is type(expected)


def main():
    tasks=json.load(sys.stdin)
    total=0
    for task in tasks:
        fn=globals()[task['fn']]
        for i,case in enumerate(task['cases'],1):
            actual=fn(*case['args'])
            assert compare(actual,case['expected'],task.get('numericMode','exact')),f"{task['id']} case {i}: expected {case['expected']!r}; oracle {actual!r}"
            total+=1
    print(f"PASS: {len(tasks)} independently implemented Python functions agree on {total} deterministic cases.")


if __name__=='__main__':
    main()
