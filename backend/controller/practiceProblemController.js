const { validateC, validateCpp, validateJava, validateJavaScript, validatePython } = require("../middleware/validate");
const saveProblemFiles = require("../middleware/saveProblemFiles");
const runPracticeDockerContainer = require("../middleware/runPracticeDockerContainer");
// Runs a practice solution against the question template in an isolated container.
const practiceProblemController = async (code, language, questionID, userEmail, userName, res) => {
        try {
                // Reject unsupported or unsafe code before creating temporary files.
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
                runPracticeDockerContainer(filename, language, userEmail, userName, questionID, code, res);
        } catch (error) {
                console.error(`Validation error for ${language}: ${error.message}`);
        }
};

module.exports = practiceProblemController;
