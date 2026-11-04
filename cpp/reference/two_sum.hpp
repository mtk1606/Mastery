#pragma once
#include <unordered_map>
#include <vector>

namespace mastery {
inline std::vector<int> two_sum(const std::vector<int>& nums, int target) {
    std::unordered_map<long long, int> seen;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        const long long need = static_cast<long long>(target) - nums[i];
        auto it = seen.find(need);
        if (it != seen.end()) return {it->second, i};
        // Insert after checking to avoid reusing the current index.
        seen.emplace(nums[i], i);
    }
    return {};
}
} // namespace mastery