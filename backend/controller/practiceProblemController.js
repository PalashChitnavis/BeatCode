const { validateC, validateCpp, validateJava, validateJavaScript, validatePython } = require("../middleware/validate");
const saveProblemFiles = require("../middleware/saveProblemFiles");
const runPracticeDockerContainer = require("../middleware/runPracticeDockerContainer");
const practiceProblemController = async (code, language, questionID, userEmail, res) => {
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
                        case "python":
                                validatePython(code);
                                break;
                        default:
                                throw new Error(`Unsupported language: ${language}`);
                }
                console.log("code is validated");
                const filename = await saveProblemFiles(code, questionID, language);
                runPracticeDockerContainer(filename, language, userEmail, questionID, code, res);
        } catch (error) {
                console.error(`Validation error for ${language}: ${error.message}`);
        }
};

module.exports = practiceProblemController;
