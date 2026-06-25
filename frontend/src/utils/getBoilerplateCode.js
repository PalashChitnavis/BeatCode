const boilerplates = {
  python: `import sys
input = sys.stdin.readline

def solve():
    pass

solve()
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    return 0;
}
`,
  java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

    }
}
`,
  javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');
let idx = 0;
const input = () => lines[idx++];

function solve() {

}

solve();
`,
}

export const getBoilerplateCode = (language, _slug) => {
  return boilerplates[language] ?? boilerplates.python
}