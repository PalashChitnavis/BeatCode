// C Validation
const validateC = (code) => {
        const maliciousWordsC = ["system", "exec", "pipe", "malloc", "free", "realloc", "delete", "fork", "system("];

        for (const word of maliciousWordsC) {
                if (code.includes(word)) {
                        throw new Error(`C Code contains forbidden word: ${word}`);
                }
        }
};

// C++ Validation
const validateCpp = (code) => {
        const maliciousWordsCpp = [
                "system",
                "exec",
                "pipe",
                "malloc",
                "free",
                "realloc",
                "delete",
                "popen",
                "fork",
                "unistd.h",
        ];

        for (const word of maliciousWordsCpp) {
                if (code.includes(word)) {
                        throw new Error(`C++ Code contains forbidden word: ${word}`);
                }
        }
};

// Java Validation
const validateJava = (code) => {
        const maliciousWordsJava = ["Runtime.exec", "ProcessBuilder", "Process", "getRuntime()", "exec(", "start()"];

        for (const word of maliciousWordsJava) {
                if (code.includes(word)) {
                        throw new Error(`Java Code contains forbidden word: ${word}`);
                }
        }
};

// JavaScript (Node.js) Validation
const validateJavaScript = (code) => {
        const maliciousWordsJavaScript = [
                "child_process.exec",
                "child_process.spawn",
                "fs.readFileSync",
                "fs.writeFileSync",
        ];

        for (const word of maliciousWordsJavaScript) {
                if (code.includes(word)) {
                        throw new Error(`JavaScript Code contains forbidden word: ${word}`);
                }
        }
};

// Python Validation
const validatePython = (code) => {
        const maliciousWordsPython = [
                "subprocess.run",
                "os.system",
                "os.spawn",
                "open",
                "read",
                "write",
                "import os",
                "import subprocess",
                "from os import",
                "from subprocess import",
        ];

        for (const word of maliciousWordsPython) {
                if (code.includes(word)) {
                        throw new Error(`Python Code contains forbidden word: ${word}`);
                }
        }
};

// Exporting the validation functions
module.exports = {
        validateC,
        validateCpp,
        validateJava,
        validateJavaScript,
        validatePython,
};
