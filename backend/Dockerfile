# Stage 1: Build C++ compiler image
FROM alpine:3.9 AS cpp-compiler

WORKDIR /usr/cpp
RUN apk add build-base

# Stage 2: Build Java compiler image
FROM alpine:latest AS java-compiler

USER root
WORKDIR /usr/java
RUN apk update
RUN apk fetch openjdk8
RUN apk add openjdk8
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"

# Stage 3: Build Python image
FROM alpine:3.9 AS python-compiler

WORKDIR /usr/py
RUN apk add python3

# Stage 4: Final application image
FROM node:alpine3.10 AS app

WORKDIR /usr/nodeapp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the compilers from previous stages
COPY --from=cpp-compiler /usr/cpp /usr/cpp
COPY --from=java-compiler /usr/java /usr/java
COPY --from=python-compiler /usr/py /usr/py

# Specify the command to run the application
CMD [ "npm", "run", "start" ]
