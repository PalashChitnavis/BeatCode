# register
curl -s -c cookies.txt -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"palash","email":"palash@test.com","password":"secret123"}' | jq

# login
curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"palash@test.com","password":"secret123"}' | jq

# me (protected)
curl -s -b cookies.txt http://localhost:3000/api/auth/me | jq

# logout
curl -s -c cookies.txt -b cookies.txt -X POST http://localhost:3000/api/auth/logout | jq

# add problem
curl -s -X POST http://localhost:3000/api/problems \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "difficulty": "easy",
    "tags": ["array", "hash-table"],
    "examples": [
      { "input": "nums = [2,7,11,15], target = 9", "expectedOutput": "[0,1]" }
    ],
    "testCases": [
      { "input": "2 7 11 15\n9", "expectedOutput": "0 1" },
      { "input": "3 2 4\n6", "expectedOutput": "1 2" }
    ],
    "constraints": "2 <= nums.length <= 10^4"
  }' | jq

# get problems
curl -s http://localhost:3000/api/problems | jq
curl -s http://localhost:3000/api/problems/two-sum | jq

# test simple
curl -s -X POST http://localhost:3000/api/execution/run \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(input())",
    "language": "python",
    "stdin": "hello world"
  }' | jq

# test problem
curl -s -X POST http://localhost:3000/api/execution/two-sum/submit \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "code": "nums, target = input().split(\"\n\")[0].split(), int(input().split(\"\n\")[0]) \nnums = list(map(int, nums))\nseen = {}\nfor i, n in enumerate(nums):\n  if target - n in seen:\n    print(seen[target-n], i)\n    break\n  seen[n] = i",
    "language": "python"
  }' | jq