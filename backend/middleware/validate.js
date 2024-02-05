// C Validation
const validateC = (code, userInput) => {
        const maliciousWordsC = ["system", "exec", "pipe", "malloc", "free", "realloc", "delete", "fork", "system("];

        for (const word of maliciousWordsC) {
                if (code.includes(word) || (userInput && userInput.includes(word))) {
                        throw new Error(`C Code or user input contains forbidden word: ${word}`);
                }
        }
};

// C++ Validation
const validateCpp = (code, userInput) => {
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
                if (code.includes(word) || (userInput && userInput.includes(word))) {
                        throw new Error(`C++ Code or user input contains forbidden word: ${word}`);
                }
        }
};

// Java Validation
const validateJava = (code, userInput) => {
        const maliciousWordsJava = ["Runtime.exec", "ProcessBuilder", "Process", "getRuntime()", "exec(", "start()"];

        for (const word of maliciousWordsJava) {
                if (code.includes(word) || (userInput && userInput.includes(word))) {
                        throw new Error(`Java Code or user input contains forbidden word: ${word}`);
                }
        }
};

// Python Validation
const validatePython = (code, userInput) => {
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
                if (code.includes(word) || (userInput && userInput.includes(word))) {
                        throw new Error(`Python Code or user input contains forbidden word: ${word}`);
                }
        }
};

// Exporting the validation functions
module.exports = {
        validateC,
        validateCpp,
        validateJava,
        validatePython,
};
