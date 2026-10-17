import type { Difficulty, Language } from "@beatcode/shared";
import type { Arg, Signature } from "./codegen";

export interface TestDef {
  args: Arg[];
  sample?: boolean;
  explanation?: string;
}

export interface ProblemDef {
  number: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  constraints: string[];
  timeLimitMs?: number;
  signature: Signature;
  /** Source of truth for expected outputs. */
  reference: (...args: Arg[]) => number;
  tests: TestDef[];
  solutions: Record<Language, string>;
}

/** Deterministic PRNG so seeded test data is identical on every run. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomArray(seed: number, length: number, min: number, max: number): number[] {
  const rand = mulberry32(seed);
  return Array.from({ length }, () => min + Math.floor(rand() * (max - min + 1)));
}

const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

export const problems: ProblemDef[] = [
  {
    number: 1,
    slug: "sum-of-array",
    title: "Sum of Array Elements",
    difficulty: "EASY",
    tags: ["array"],
    description: "Given an integer array `nums`, return the sum of all of its elements.",
    constraints: ["0 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    signature: { fn: "sumArray", params: [{ name: "nums", type: "int[]" }], returns: "int" },
    reference: (nums) => sum(nums as number[]),
    tests: [
      { args: [[1, 2, 3]], sample: true, explanation: "1 + 2 + 3 = 6." },
      { args: [[5, 5, 5]], sample: true, explanation: "5 + 5 + 5 = 15." },
      { args: [[10, -2, 8]], sample: true, explanation: "10 - 2 + 8 = 16." },
      { args: [[]] },
      { args: [[-10000]] },
      { args: [randomArray(1, 1000, -10000, 10000)] },
      { args: [randomArray(2, 100000, -10000, 10000)] },
      { args: [Array(100000).fill(10000)] },
    ],
    solutions: {
      c: `int sumArray(int* nums, int numsSize) {\n    int total = 0;\n    for (int i = 0; i < numsSize; i++) total += nums[i];\n    return total;\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int sumArray(vector<int>& nums) {\n        int total = 0;\n        for (int x : nums) total += x;\n        return total;\n    }\n};\n`,
      java: `class Solution {\n    public int sumArray(int[] nums) {\n        int total = 0;\n        for (int x : nums) total += x;\n        return total;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def sumArray(self, nums: List[int]) -> int:\n        return sum(nums)\n`,
    },
  },
  {
    number: 2,
    slug: "maximum-element",
    title: "Find Maximum Element",
    difficulty: "EASY",
    tags: ["array"],
    description: "Given a non-empty integer array `nums`, return its largest element.",
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    signature: { fn: "maxElement", params: [{ name: "nums", type: "int[]" }], returns: "int" },
    reference: (nums) => (nums as number[]).reduce((a, b) => Math.max(a, b)),
    tests: [
      { args: [[1, 5, 3]], sample: true, explanation: "5 is the largest element." },
      { args: [[10, 2, 8]], sample: true, explanation: "10 is the largest element." },
      { args: [[-1, -5, -3]], sample: true, explanation: "-1 is the largest element." },
      { args: [[7]] },
      { args: [[-1000000000, -999999999]] },
      { args: [randomArray(3, 100000, -1000000000, 1000000000)] },
    ],
    solutions: {
      c: `int maxElement(int* nums, int numsSize) {\n    int best = nums[0];\n    for (int i = 1; i < numsSize; i++) if (nums[i] > best) best = nums[i];\n    return best;\n}\n`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxElement(vector<int>& nums) {\n        return *max_element(nums.begin(), nums.end());\n    }\n};\n`,
      java: `class Solution {\n    public int maxElement(int[] nums) {\n        int best = nums[0];\n        for (int x : nums) best = Math.max(best, x);\n        return best;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def maxElement(self, nums: List[int]) -> int:\n        return max(nums)\n`,
    },
  },
  {
    number: 3,
    slug: "minimum-element",
    title: "Find Minimum Element",
    difficulty: "EASY",
    tags: ["array"],
    description: "Given a non-empty integer array `nums`, return its smallest element.",
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    signature: { fn: "minElement", params: [{ name: "nums", type: "int[]" }], returns: "int" },
    reference: (nums) => (nums as number[]).reduce((a, b) => Math.min(a, b)),
    tests: [
      { args: [[1, 5, 3]], sample: true, explanation: "1 is the smallest element." },
      { args: [[10, 2, 8]], sample: true, explanation: "2 is the smallest element." },
      { args: [[-1, -5, -3]], sample: true, explanation: "-5 is the smallest element." },
      { args: [[42]] },
      { args: [[1000000000, 999999999]] },
      { args: [randomArray(4, 100000, -1000000000, 1000000000)] },
    ],
    solutions: {
      c: `int minElement(int* nums, int numsSize) {\n    int best = nums[0];\n    for (int i = 1; i < numsSize; i++) if (nums[i] < best) best = nums[i];\n    return best;\n}\n`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minElement(vector<int>& nums) {\n        return *min_element(nums.begin(), nums.end());\n    }\n};\n`,
      java: `class Solution {\n    public int minElement(int[] nums) {\n        int best = nums[0];\n        for (int x : nums) best = Math.min(best, x);\n        return best;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def minElement(self, nums: List[int]) -> int:\n        return min(nums)\n`,
    },
  },
  {
    number: 4,
    slug: "count-occurrences",
    title: "Count Occurrences",
    difficulty: "EASY",
    tags: ["array", "counting"],
    description:
      "Given an integer array `nums` and an integer `target`, return how many times `target` appears in `nums`.",
    constraints: ["0 <= nums.length <= 10^5", "-10^4 <= nums[i], target <= 10^4"],
    signature: {
      fn: "countOccurrences",
      params: [
        { name: "nums", type: "int[]" },
        { name: "target", type: "int" },
      ],
      returns: "int",
    },
    reference: (nums, target) => (nums as number[]).filter((x) => x === target).length,
    tests: [
      { args: [[1, 2, 3, 1], 1], sample: true, explanation: "1 appears twice." },
      { args: [[1, 2, 3], 4], sample: true, explanation: "4 does not appear." },
      { args: [[], 5], sample: true, explanation: "The array is empty." },
      { args: [[7, 7, 7, 7], 7] },
      { args: [randomArray(5, 100000, -5, 5), 3] },
    ],
    solutions: {
      c: `int countOccurrences(int* nums, int numsSize, int target) {\n    int count = 0;\n    for (int i = 0; i < numsSize; i++) if (nums[i] == target) count++;\n    return count;\n}\n`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countOccurrences(vector<int>& nums, int target) {\n        return count(nums.begin(), nums.end(), target);\n    }\n};\n`,
      java: `class Solution {\n    public int countOccurrences(int[] nums, int target) {\n        int count = 0;\n        for (int x : nums) if (x == target) count++;\n        return count;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def countOccurrences(self, nums: List[int], target: int) -> int:\n        return nums.count(target)\n`,
    },
  },
  {
    number: 5,
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    tags: ["array", "two-pointers", "greedy"],
    description:
      "You are given an integer array `height` of length `n`. There are `n` vertical lines where the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that, together with the x-axis, form a container that holds the most water, and return the maximum amount of water it can store.\n\nAn `O(n^2)` solution will exceed the time limit.",
    constraints: ["2 <= height.length <= 10^5", "0 <= height[i] <= 10^4"],
    signature: { fn: "maxArea", params: [{ name: "height", type: "int[]" }], returns: "int" },
    reference: (h) => {
      const height = h as number[];
      let [l, r, best] = [0, height.length - 1, 0];
      while (l < r) {
        best = Math.max(best, Math.min(height[l]!, height[r]!) * (r - l));
        if (height[l]! < height[r]!) l++;
        else r--;
      }
      return best;
    },
    tests: [
      {
        args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
        sample: true,
        explanation: "Lines at indices 1 and 8 hold min(8, 7) * (8 - 1) = 49 units of water.",
      },
      { args: [[1, 1]], sample: true, explanation: "The only container holds min(1, 1) * 1 = 1." },
      { args: [[4, 3, 2, 1, 4]], sample: true, explanation: "Indices 0 and 4 hold min(4, 4) * 4 = 16." },
      { args: [[0, 0, 0]] },
      { args: [[1, 2, 1]] },
      { args: [randomArray(6, 1000, 0, 10000)] },
      { args: [randomArray(7, 100000, 0, 10000)] },
      { args: [Array.from({ length: 100000 }, (_, i) => (i < 50000 ? i % 10000 : (100000 - i) % 10000))] },
    ],
    solutions: {
      c: `int maxArea(int* height, int heightSize) {\n    int l = 0, r = heightSize - 1, best = 0;\n    while (l < r) {\n        int h = height[l] < height[r] ? height[l] : height[r];\n        int area = h * (r - l);\n        if (area > best) best = area;\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return best;\n}\n`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = (int)height.size() - 1, best = 0;\n        while (l < r) {\n            best = max(best, min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++; else r--;\n        }\n        return best;\n    }\n};\n`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, best = 0;\n        while (l < r) {\n            best = Math.max(best, Math.min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++; else r--;\n        }\n        return best;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def maxArea(self, height: List[int]) -> int:\n        l, r, best = 0, len(height) - 1, 0\n        while l < r:\n            best = max(best, min(height[l], height[r]) * (r - l))\n            if height[l] < height[r]:\n                l += 1\n            else:\n                r -= 1\n        return best\n`,
    },
  },
  {
    number: 6,
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "MEDIUM",
    tags: ["array", "dynamic-programming"],
    description:
      "Given a non-empty integer array `nums`, find the contiguous subarray (containing at least one number) with the largest sum and return that sum.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    signature: { fn: "maxSubArray", params: [{ name: "nums", type: "int[]" }], returns: "int" },
    reference: (n) => {
      const nums = n as number[];
      let best = nums[0]!;
      let current = 0;
      for (const x of nums) {
        current = Math.max(x, current + x);
        best = Math.max(best, current);
      }
      return best;
    },
    tests: [
      {
        args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        sample: true,
        explanation: "The subarray [4, -1, 2, 1] has the largest sum, 6.",
      },
      { args: [[1]], sample: true, explanation: "The only subarray is [1]." },
      { args: [[5, 4, -1, 7, 8]], sample: true, explanation: "The whole array sums to 23." },
      { args: [[-3, -2, -5]] },
      { args: [randomArray(8, 1000, -10000, 10000)] },
      { args: [randomArray(9, 100000, -10000, 10000)] },
    ],
    solutions: {
      c: `int maxSubArray(int* nums, int numsSize) {\n    int best = nums[0], current = 0;\n    for (int i = 0; i < numsSize; i++) {\n        current = current + nums[i] > nums[i] ? current + nums[i] : nums[i];\n        if (current > best) best = current;\n    }\n    return best;\n}\n`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int best = nums[0], current = 0;\n        for (int x : nums) {\n            current = max(x, current + x);\n            best = max(best, current);\n        }\n        return best;\n    }\n};\n`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int best = nums[0], current = 0;\n        for (int x : nums) {\n            current = Math.max(x, current + x);\n            best = Math.max(best, current);\n        }\n        return best;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        best, current = nums[0], 0\n        for x in nums:\n            current = max(x, current + x)\n            best = max(best, current)\n        return best\n`,
    },
  },
  {
    number: 7,
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "HARD",
    tags: ["array", "two-pointers", "stack"],
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    constraints: ["1 <= height.length <= 10^5", "0 <= height[i] <= 10^4"],
    signature: { fn: "trap", params: [{ name: "height", type: "int[]" }], returns: "int" },
    reference: (h) => {
      const height = h as number[];
      let [l, r, leftMax, rightMax, water] = [0, height.length - 1, 0, 0, 0];
      while (l < r) {
        if (height[l]! < height[r]!) {
          leftMax = Math.max(leftMax, height[l]!);
          water += leftMax - height[l]!;
          l++;
        } else {
          rightMax = Math.max(rightMax, height[r]!);
          water += rightMax - height[r]!;
          r--;
        }
      }
      return water;
    },
    tests: [
      {
        args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
        sample: true,
        explanation: "6 units of water are trapped between the bars.",
      },
      { args: [[4, 2, 0, 3, 2, 5]], sample: true, explanation: "9 units of water are trapped." },
      { args: [[1]] },
      { args: [[3, 0, 3]] },
      { args: [[5, 4, 3, 2, 1]] },
      { args: [randomArray(10, 1000, 0, 10000)] },
      { args: [randomArray(11, 100000, 0, 10000)] },
    ],
    solutions: {
      c: `int trap(int* height, int heightSize) {\n    int l = 0, r = heightSize - 1, leftMax = 0, rightMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] > leftMax) leftMax = height[l];\n            water += leftMax - height[l++];\n        } else {\n            if (height[r] > rightMax) rightMax = height[r];\n            water += rightMax - height[r--];\n        }\n    }\n    return water;\n}\n`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = (int)height.size() - 1, leftMax = 0, rightMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                leftMax = max(leftMax, height[l]);\n                water += leftMax - height[l++];\n            } else {\n                rightMax = max(rightMax, height[r]);\n                water += rightMax - height[r--];\n            }\n        }\n        return water;\n    }\n};\n`,
      java: `class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                leftMax = Math.max(leftMax, height[l]);\n                water += leftMax - height[l++];\n            } else {\n                rightMax = Math.max(rightMax, height[r]);\n                water += rightMax - height[r--];\n            }\n        }\n        return water;\n    }\n}\n`,
      python: `from typing import List\n\nclass Solution:\n    def trap(self, height: List[int]) -> int:\n        l, r = 0, len(height) - 1\n        left_max = right_max = water = 0\n        while l < r:\n            if height[l] < height[r]:\n                left_max = max(left_max, height[l])\n                water += left_max - height[l]\n                l += 1\n            else:\n                right_max = max(right_max, height[r])\n                water += right_max - height[r]\n                r -= 1\n        return water\n`,
    },
  },
];
