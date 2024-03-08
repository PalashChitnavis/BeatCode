export const getBoilerplateCode = (location, language, question) => {
        if (location.pathname === "/onlinecompiler" || location.pathname.startsWith("/room")) {
                const starterCodes = {
                        c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
                        cpp: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
                        java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
                        python: `print("Hello, World!")`,
                        javascript: `console.log("Hello, World!");`,
                };
                return starterCodes[language];
        } else if (location.pathname.startsWith("/practiceproblems")) {
                return question?.boilerplate[language];
        } else {
                return "";
        }
};
