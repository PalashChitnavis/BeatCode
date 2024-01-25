const { validateC, validateCpp, validateJava, validateJavaScript, validatePython } = require("../middleware/validate");
const writeCodeToFile = require("../middleware/writeCodeToFile");
const onlineCompiler = (code, language, userInput) => {
        try {
                switch (language) {
                        case "c":
                                validateC(code);
                                break;
                        case "cpp":
                                validateCpp(code);
                                break;
                        case "java":
                                validateJava(code);
                                break;
                        case "javascript":
                                validateJavaScript(code);
                                break;
                        case "python":
                                validatePython(code);
                                break;
                        default:
                                throw new Error(`Unsupported language: ${language}`);
                }

                const fileName = writeCodeToFile(code, language);

                console.log(`Request for ${language} compilation received.`);
                console.log(`Code has been validated for ${language}.`);
                console.log(`File saved as: ${fileName}`);
        } catch (error) {
                console.error(`Validation error for ${language}: ${error.message}`);
        }
};

module.exports = onlineCompiler;
