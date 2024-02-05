const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Question = require("../models/Question");

const saveProblemFiles = async (code, questionID, language) => {
        try {
                const question = await Question.findOne({ id: questionID });
                //Generate a unique filename using UUID
                const filename = uuidv4();

                // Define file paths
                const codeFilePath = path.join(__dirname, `../${filename}.${language === "python" ? "py" : language}`);
                const userInputFilePath = path.join(__dirname, `../${filename}.txt`);
                const fileContent = `${code}\n${question.templatecode[language]}`;

                // Write code to file
                fs.writeFileSync(codeFilePath, fileContent);
                fs.writeFileSync(userInputFilePath, "");

                console.log(`Code saved successfully with filename: ${filename}`);
                return filename; // Return the generated filename
        } catch (error) {
                console.error("Error saving code and user input:", error);
                throw error;
        }
};

module.exports = saveProblemFiles;
