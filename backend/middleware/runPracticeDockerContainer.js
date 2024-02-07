const { stderr } = require("process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const isWindows = process.platform === "win32";
const PracticeSubmission = require("../models/PracticeSubmission");
const runPracticeDockerContainer = (filename, language, userEmail, questionID, code, res) => {
        switch (language) {
                case "cpp":
                        cppDocker(filename, language, userEmail, questionID, code, res);
                        break;
                case "c":
                        cppDocker(filename, language, userEmail, questionID, code, res);
                        break;
                case "java":
                        javaDocker(filename, userEmail, questionID, code, res);
                        break;
                case "python":
                        pythonDocker(filename, userEmail, questionID, code, res);
                        break;
        }
};

const cppDocker = (filename, language, userEmail, questionID, code, res) => {
        let containerID; // Define containerID variable outside of the promise chain
        exec(`docker run -d -it cpp:v1 sh`)
                .then((response) => {
                        containerID = response.stdout.substring(0, 12); // Assign value to containerID
                        console.log("Container ID:", containerID);
                        return exec(
                                `docker cp ${filename}.${language} ${containerID}:/usr/cpp && docker cp ${filename}.txt ${containerID}:/usr/cpp`
                        );
                })
                .then(() => {
                        return exec(
                                `docker exec -t ${containerID} sh -c "g++ ${filename}.${language} -o ./a && ./a<${filename}.txt"`
                        );
                })
                .then((resp) => {
                        console.log(resp);
                        const failedStatus = resp.stdout.includes("Failed");
                        const status = !failedStatus;
                        if (userEmail) {
                                try {
                                        const submission = new PracticeSubmission({
                                                user_email: userEmail,
                                                language: language,
                                                code: code,
                                                output: resp.stdout,
                                                question_id: questionID,
                                        });
                                        submission.save();
                                } catch (err) {
                                        console.log(err);
                                }
                        }
                        const deleteCmd = isWindows
                                ? `del ${filename}.${language} ${filename}.txt`
                                : `rm ${filename}.${language} ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                                res.status(201).json({ resp: resp, status: status });
                        });
                })
                .catch((error) => {
                        console.error("Error:", error);
                        res.json({ stderr: error.stderr });
                        const deleteCmd = isWindows
                                ? `del ${filename}.${language} ${filename}.txt`
                                : `rm ${filename}.${language} ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                        });
                });
};
const pythonDocker = (filename, userEmail, questionID, code, res) => {
        let containerID;
        exec(`docker run -d -it py:v1 sh`)
                .then((response) => {
                        containerID = response.stdout.substring(0, 12);
                        console.log("Container ID:", containerID);
                        return exec(
                                `docker cp ${filename}.py ${containerID}:/usr/py && docker cp ${filename}.txt ${containerID}:/usr/py`
                        );
                })
                .then(() => {
                        return exec(
                                `docker exec -t ${containerID} sh -c "python3 /usr/py/${filename}.py < /usr/py/${filename}.txt"`
                        );
                })
                .then((resp) => {
                        console.log(resp);
                        const failedStatus = resp.stdout.includes("Failed");
                        const status = !failedStatus;
                        if (userEmail) {
                                try {
                                        const submission = new PracticeSubmission({
                                                user_email: userEmail,
                                                language: "python",
                                                code: code,
                                                output: resp.stdout,
                                                question_id: questionID,
                                        });
                                        submission.save();
                                } catch (err) {
                                        console.log(err);
                                }
                        }
                        const deleteCmd = isWindows
                                ? `del ${filename}.py ${filename}.txt`
                                : `rm ${filename}.py ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("Container and files removed");
                                res.status(201).json({ resp: resp, status: status });
                        });
                })
                .catch((error) => {
                        console.error("Error:", error);
                        res.json({ stderr: error.stderr });
                        const deleteCmd = isWindows
                                ? `del ${filename}.py ${filename}.txt`
                                : `rm ${filename}.py ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                        });
                });
};

const javaDocker = (filename, userEmail, questionID, code, res) => {
        let containerID;
        exec(`docker run -d -it java:v1 sh`)
                .then((response) => {
                        containerID = response.stdout.substring(0, 12);
                        console.log("Container ID:", containerID);
                        return exec(
                                `docker cp ${filename}.java ${containerID}:/usr/java/Main.java && docker cp ${filename}.txt ${containerID}:/usr/java`
                        );
                })
                .then(() => {
                        return exec(`docker exec -t ${containerID} sh -c "javac /usr/java/Main.java"`);
                })
                .then(() => {
                        return exec(
                                `docker exec -t ${containerID} sh -c "java -classpath /usr/java Main < /usr/java/${filename}.txt"`
                        );
                })
                .then((resp) => {
                        console.log(resp);

                        const failedStatus = resp.stdout.includes("Failed");
                        const status = !failedStatus;
                        if (userEmail) {
                                try {
                                        const submission = new PracticeSubmission({
                                                user_email: userEmail,
                                                language: "java",
                                                code: code,
                                                output: resp.stdout,
                                                question_id: questionID,
                                        });
                                        submission.save();
                                } catch (err) {
                                        console.log(err);
                                }
                        }
                        const deleteCmd = isWindows
                                ? `del ${filename}.java ${filename}.txt`
                                : `rm ${filename}.java ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("Container and files removed");
                                res.status(201).json({ resp: resp, status: status });
                        });
                })
                .catch((error) => {
                        console.error("Error:", error);
                        res.json({ stderr: error.stdout });
                        const deleteCmd = isWindows
                                ? `del ${filename}.java ${filename}.txt`
                                : `rm ${filename}.java ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                        });
                });
};

module.exports = runPracticeDockerContainer;
