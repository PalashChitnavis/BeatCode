const { validateC, validateCpp, validateJava, validateJavaScript, validatePython } = require("../middleware/validate");
const onlineCompiler = (code, language, userInput) => {
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
                        case "javascript":
                                validateJavaScript(code, userInput);
                                break;
                        case "python":
                                validatePython(code, userInput);
                                break;
                        default:
                                throw new Error(`Unsupported language: ${language}`);
                }
                console.log("code is validated");
        } catch (error) {
                console.error(`Validation error for ${language}: ${error.message}`);
        }
};

module.exports = onlineCompiler;
