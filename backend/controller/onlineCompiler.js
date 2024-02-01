const { validateC, validateCpp, validateJava, validateJavaScript, validatePython } = require("../middleware/validate");
const saveCodeFiles = require("../middleware/saveCodeFiles");
const runDockerContainer = require("../middleware/runDockerContainer");
const onlineCompiler = (code, language, userInput, res) => {
        try {
                switch (language) {
                        case "c":
                                validateC(code, userInput);
                                break;
                        case "cpp":
                                validateCpp(code, userInput);
                                break;
                        case "java":
                                validateJava(code, userInput);
                                break;
                        case "python":
                                validatePython(code, userInput);
                                break;
                        default:
                                throw new Error(`Unsupported language: ${language}`);
                }
                console.log("code is validated");
                const filename = saveCodeFiles(code, userInput, language);
                runDockerContainer(filename, language, res);
        } catch (error) {
                console.error(`Validation error for ${language}: ${error.message}`);
        }
};

module.exports = onlineCompiler;
