const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const saveCodeFiles = (code, userInput, language) => {
        try {
                // Generate a unique filename using UUID
                const filename = uuidv4();

                // Define file paths
                const codeFilePath = path.join(__dirname, `../${filename}.${language}`);
                const userInputFilePath = path.join(__dirname, `../${filename}.txt`);

                // Write code to file
                fs.writeFileSync(codeFilePath, code);

                // Write user input to file
                fs.writeFileSync(userInputFilePath, userInput);

                console.log(`Code and user input saved successfully with filename: ${filename}`);
                return filename; // Return the generated filename
        } catch (error) {
                console.error("Error saving code and user input:", error);
                throw error;
        }
};

module.exports = saveCodeFiles;
