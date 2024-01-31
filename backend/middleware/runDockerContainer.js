const util = require("util");
const exec = util.promisify(require("child_process").exec);
const isWindows = process.platform === "win32";
const runDockerContainer = (filename, language, res) => {
        switch (language) {
                case "cpp":
                        cppDocker(filename, res);
                        break;
        }
};

const cppDocker = (filename, res) => {
        let containerID; // Define containerID variable outside of the promise chain
        exec(`docker run -d -it cpp:v1 sh`)
                .then((response) => {
                        containerID = response.stdout.substring(0, 12); // Assign value to containerID
                        console.log("Container ID:", containerID);
                        return exec(
                                `docker cp ${filename}.cpp ${containerID}:/usr/cpp && docker cp ${filename}.txt ${containerID}:/usr/cpp`
                        );
                })
                .then(() => {
                        return exec(
                                `docker exec -t ${containerID} sh -c "g++ ${filename}.cpp -o ./a && ./a<${filename}.txt"`
                        );
                })
                .then((resp) => {
                        console.log(resp);
                        const deleteCmd = isWindows
                                ? `del ${filename}.cpp ${filename}.txt`
                                : `rm ${filename}.cpp ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                                res.status(201).json(resp); // Send the response here
                        });
                })
                .catch((error) => {
                        console.error("Error:", error);
                        res.status(500).json({ error: "Internal Server Error" }); // Send error response
                });
};

module.exports = runDockerContainer;
