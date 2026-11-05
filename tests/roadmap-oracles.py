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



# Phase XIII: independent reference oracles for all added Foundation Python labs.
def clamp_score(value, low, high):
    if value < low:
        return low
    if value > high:
        return high
    return value


def first_positive(values):
    hits = [i for i, v in enumerate(values) if v > 0]
    return hits[0] if hits else -1


def count_nonnegative(values):
    return len([v for v in values if v >= 0])


def unique_in_order(values):
    return list(dict.fromkeys(values))


def safe_divide(numerator, denominator):
    return numerator / denominator if denominator != 0 else None


def running_totals(values):
    return [sum(values[:i]) for i in range(1, len(values) + 1)]


def two_sum_indices(nums, target):
    for j in range(len(nums)):
        for i in range(j):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []


def balanced_brackets(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in '([{':
            stack.append(char)
        elif not stack or stack.pop() != pairs[char]:
            return False
    return len(stack) == 0


def coin_ways(coins, target):
    from functools import lru_cache

    @lru_cache(None)
    def rec(i, remaining):
        if remaining == 0:
            return 1
        if i == len(coins):
            return 0
        total = 0
        for count in range(remaining // coins[i] + 1):
            total += rec(i + 1, remaining - count * coins[i])
        return total

    return rec(0, target)


def bayes_update(prior, sensitivity, false_positive_rate):
    total_positive = prior * sensitivity + (1 - prior) * false_positive_rate
    if not total_positive:
        return None
    return prior * sensitivity / total_positive


def bernoulli_stderr(p, n):
    return math.sqrt((p - p * p) / n)


def matrix_vector(matrix, vector):
    return [sum(row[i] * vector[i] for i in range(len(row))) for row in matrix]


def aggregate_trades(events):
    first = {}
    for event_id, symbol, quantity in events:
        if event_id not in first:
            first[event_id] = (symbol, quantity)
    totals = {}
    for symbol, quantity in first.values():
        totals[symbol] = totals.get(symbol, 0) + quantity
    return totals


def http_status_classes(codes):
    return {
        '2xx': sum(200 <= c < 300 for c in codes),
        '4xx': sum(400 <= c < 500 for c in codes),
        '5xx': sum(500 <= c < 600 for c in codes),
    }


def nearest_rank_p95(values):
    if not values:
        return None
    return sorted(values)[math.ceil(len(values) * 95 / 100) - 1]


def main():
    tasks=json.load(sys.stdin)
    total=0
    for task in tasks:
        fn=globals()[task['fn']]
        reference={}
        exec(compile(task['solution'], '<published-reference-'+task['id']+'>', 'exec'), reference)
        student_reference=reference[task['fn']]
        for i,case in enumerate(task['cases'],1):
            actual=fn(*case['args'])
            published=student_reference(*case['args'])
            expected=case['expected']
            mode=task.get('numericMode','exact')
            assert compare(actual,expected,mode),f"{task['id']} case {i}: expected {expected!r}; oracle {actual!r}"
            assert compare(published,expected,mode),f"{task['id']} case {i}: published reference {published!r} differs from {expected!r}"
            total+=1
    print(f"PASS: {len(tasks)} independent Python oracles and published solution sources both agree on {total} deterministic cases.")


if __name__=='__main__':
    main()
