# Use the official Node.js image from Docker Hub
FROM node:alpine3.10

# Set the working directory in the container
WORKDIR /usr/nodeapp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Specify the command to run the application
CMD [ "npm", "run", "start" ]
