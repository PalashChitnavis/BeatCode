import type { Language } from "@beatcode/shared";

/** Starter programs for the playground and code rooms. */
export const HELLO_WORLD: Record<Language, string> = {
  c: '#include <stdio.h>\n\nint main(void) {\n    char name[64];\n    if (scanf("%63s", name) == 1) printf("Hello, %s!\\n", name);\n    else printf("Hello, World!\\n");\n    return 0;\n}\n',
  cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    if (cin >> name) cout << "Hello, " << name << "!" << endl;\n    else cout << "Hello, World!" << endl;\n    return 0;\n}\n',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        String name = in.hasNext() ? in.next() : "World";\n        System.out.println("Hello, " + name + "!");\n    }\n}\n',
  python: 'import sys\n\nname = sys.stdin.read().strip() or "World"\nprint(f"Hello, {name}!")\n',
};
