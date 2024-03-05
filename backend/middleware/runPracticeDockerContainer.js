const { stderr } = require("process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const isWindows = process.platform === "win32";
const PracticeSubmission = require("../models/PracticeSubmission");
const Question = require("../models/Question");
const UserStats = require("../models/UserStats");
const runPracticeDockerContainer = (filename, language, userEmail, userName, questionID, code, res) => {
        switch (language) {
                case "cpp":
                        cppDocker(filename, language, userEmail, userName, questionID, code, res);
                        break;
                case "c":
                        cppDocker(filename, language, userEmail, userName, questionID, code, res);
                        break;
                case "java":
                        javaDocker(filename, userEmail, userName, questionID, code, res);
                        break;
                case "python":
                        pythonDocker(filename, userEmail, userName, questionID, code, res);
                        break;
        }
};

const cppDocker = (filename, language, userEmail, userName, questionID, code, res) => {
        let containerID; // Define containerID variable outside of the promise chain
        exec(`docker run -d -it palashchitnavis/beatcode-cpp sh`)
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
                .then(async (resp) => {
                        console.log(resp);
                        const failedStatus = resp.stdout.includes("Failed");
                        const status = !failedStatus;
                        const practiceStatus = status ? "Passed" : "Failed";
                        if (userEmail && userName) {
                                try {
                                        const submission = new PracticeSubmission({
                                                user_email: userEmail,
                                                user_name: userName,
                                                language: language,
                                                code: code,
                                                output: resp.stdout,
                                                question_id: questionID,
                                                status: practiceStatus,
                                        });
                                        submission.save();
                                        if (status) {
                                                const question = await Question.findOne({ id: questionID });
                                                let userStats = await UserStats.findOne({ emailID: userEmail });
                                                if (!userStats) {
                                                        userStats = new UserStats({
                                                                emailID: userEmail,
                                                                userName: userName,
                                                        });
                                                }
                                                if (!userStats.attemptedQuestions.includes(question.id)) {
                                                        if (question.diff === "easy") {
                                                                userStats.attempts.easy++;
                                                        }
                                                        if (question.diff === "medium") {
                                                                userStats.attempts.medium++;
                                                        }
                                                        if (question.diff === "hard") {
                                                                userStats.attempts.hard++;
                                                        }
                                                        userStats.attemptedQuestions.push(questionID);
                                                }
                                                await userStats.save();
                                        }
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
                        res.json({ stderr: error.stdout });
                        const deleteCmd = isWindows
                                ? `del ${filename}.${language} ${filename}.txt`
                                : `rm ${filename}.${language} ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                        });
                });
};
const pythonDocker = (filename, userEmail, userName, questionID, code, res) => {
        let containerID;
        exec(`docker run -d -it palashchitnavis/beatcode-python sh`)
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
                .then(async (resp) => {
                        console.log(resp);
                        const failedStatus = resp.stdout.includes("Failed");
                        const status = !failedStatus;
                        const practiceStatus = status ? "Passed" : "Failed";
                        if (userEmail && userName) {
                                try {
                                        const submission = new PracticeSubmission({
                                                user_email: userEmail,
                                                user_name: userName,
                                                language: "python",
                                                code: code,
                                                output: resp.stdout,
                                                question_id: questionID,
                                                status: practiceStatus,
                                        });
                                        submission.save();
                                        if (status) {
                                                const question = await Question.findOne({ id: questionID });
                                                let userStats = await UserStats.findOne({ emailID: userEmail });
                                                if (!userStats) {
                                                        userStats = new UserStats({
                                                                emailID: userEmail,
                                                                userName: userName,
                                                        });
                                                }
                                                if (!userStats.attemptedQuestions.includes(questionID)) {
                                                        if (question.diff === "easy") {
                                                                userStats.attempts.easy++;
                                                        }
                                                        if (question.diff === "medium") {
                                                                userStats.attempts.medium++;
                                                        }
                                                        if (question.diff === "hard") {
                                                                userStats.attempts.hard++;
                                                        }
                                                        userStats.attemptedQuestions.push(questionID);
                                                }
                                                await userStats.save();
                                        }
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
                        res.json({ stderr: error.stdout });
                        const deleteCmd = isWindows
                                ? `del ${filename}.py ${filename}.txt`
                                : `rm ${filename}.py ${filename}.txt`;
                        exec(`docker rm -f ${containerID} && ${deleteCmd}`).then(() => {
                                console.log("container and files removed");
                        });
                });
};

const javaDocker = (filename, userEmail, userName, questionID, code, res) => {
        let containerID;
        exec(`docker run -d -it palashchitnavis/beatcode-java sh`)
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
                .then(async (resp) => {
                        console.log(resp);

                        const failedStatus = resp.stdout.includes("Failed");
                        const status = !failedStatus;
                        const practiceStatus = status ? "Passed" : "Failed";
                        if (userEmail && userName) {
                                try {
                                        const submission = new PracticeSubmission({
                                                user_email: userEmail,
                                                user_name: userName,
                                                language: "java",
                                                code: code,
                                                output: resp.stdout,
                                                question_id: questionID,
                                                status: practiceStatus,
                                        });
                                        submission.save();
                                        if (status) {
                                                const question = await Question.findOne({ id: questionID });
                                                let userStats = await UserStats.findOne({ emailID: userEmail });
                                                if (!userStats) {
                                                        userStats = new UserStats({
                                                                emailID: userEmail,
                                                                userName: userName,
                                                        });
                                                }
                                                if (!userStats.attemptedQuestions.includes(question.id)) {
                                                        if (question.diff === "easy") {
                                                                userStats.attempts.easy++;
                                                        }
                                                        if (question.diff === "medium") {
                                                                userStats.attempts.medium++;
                                                        }
                                                        if (question.diff === "hard") {
                                                                userStats.attempts.hard++;
                                                        }
                                                        userStats.attemptedQuestions.push(questionID);
                                                }
                                                await userStats.save();
                                        }
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
