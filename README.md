![Cover](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/cover.png)

# BeatCode

**BeatCode** : Your go-to platform for seamless remote coding, collaboration, and practice.

## Authors

- [Palash Chitnavis](https://www.github.com/PalashChitnavis)
- [Mahesh Suryawanshi](https://github.com/maheshcodes12)

## About The Project

![HomePage](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/home-page.png)

Welcome to **BeatCode**, your ultimate coding companion! With a sleek interface and powerful functionality, BeatCode offers:

- **Online compiler** for seamless code execution.
- **Practice problems** akin to LeetCode for honing your skills.
- **Code room** , enabling collaborative coding with video call support.

Experience coding like never before with BeatCode.

## Features

1. Enhanced security with code sanitization and isolated Docker containers for each run, ensuring host machine integrity.
2. Implemented Socket IO rooms for collaborative coding, optimizing resource usage with limited time and memory constraints.
3. Utilized MongoDB for efficient data storage and retrieval in the practice problem section, offering a seamless learning experience.
4. Integrated Google authentication for streamlined user access and authentication, ensuring a secure and personalized environment.
5. Leveraged Docker technology to encapsulate code execution environments, used Socket IO for real-time collaboration, and MongoDB for data management, ensuring a robust and scalable platform.

## Build With

**Client :** _React JS , Tailwind_

**Server :** _Node JS , Express JS , Docker_

**Database :** _MongoDB_

## Screenshots

1. Question Page![App Screenshot](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/question.png)
2. Practice Problems List
   ![App Screenshot](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/practice-problems.png)
3. Successfull Submission
   ![App Screenshot](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/successful.png)
4. Code Room
   ![App Screenshot](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/coderoom.png)
5. Online Compiler
   ![App Screenshot](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/compiler.png)
6. Leaderboard Page
   ![App Screenshot](https://github.com/PalashChitnavis/BeatCode/blob/master/frontend/public/leaderboard.png)

## Prerequisites

- docker

```bash
	curl -fsSL https://get.docker.com -o get-docker.sh
```

```bash
	sudo sh get-docker.sh
```

## Run Locally

Clone the project

```bash
	git clone https://github.com/PalashChitnavis/BeatCode
```

Go to the backend project directory

```bash
	cd BeatCode/backend
```

Install dependencies

```bash
	npm install
```

Build the Docker images

```bash
	cd BeatCode/backend/DockerFiles
```

```bash
	sudo docker build -t java:v1 ./java
```

```bash
	sudo docker build -t cpp:v1 ./cpp
```

```bash
	sudo docker build -t py:v1 ./python
```

## Usage

- To start the backend server in Development mode

```bash
	cd BeatCode/backend
	npm run dev
```

- To start the frontend server in Development mode

```bash
	cd BeatCode/frontend
	npm run dev
```

## Environment Variables

Create a **.env** file , in both backend and frontend .

**Frontend** **.env**

        VITE_FRONTEND_URL=http://localhost:5173
        VITE_BACKEND_URL=http://localhost:3000

**Backend** **.env**

        PORT=3000
        DB_URL=mongodb://localhost:27017/BeatCodeSample
        GOOGLE_CLIENT_ID=YouCannotHaveGoogleSignUpInTheSample
        GOOGLE_CLIENT_SECRET=GoWatch12AngryMen
        FRONTEND_URL=http://localhost:5173
        BACKEND_URL=http://localhost:3000

**You cannot have Google Authentication when you run the project locally**

---
