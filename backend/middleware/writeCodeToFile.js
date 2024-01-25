const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const writeCodeToFile = (code, language) => {
        const fileName = `${uuidv4()}.${language}`;
        const filePath = path.join(__dirname, "..", "codeFiles", fileName);
        fs.writeFileSync(filePath, code);
        return fileName;
};
module.exports = writeCodeToFile;
