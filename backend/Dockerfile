FROM node:18-slim


WORKDIR /usr/app
ENV PORT=3000
ENV DB_URL=mongodb+srv://palashchitnavis:palashmahesh@beatcode.r1b6civ.mongodb.net/?retryWrites=true&w=majority
ENV GOOGLE_CLIENT_ID=387562730417-12s95lvq3jtp2t8ol6i258m670f4n0j4.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV FRONTEND_URL=http://localhost:5173
ENV BACKEND_URL=http://ec2-13-200-171-130.ap-south-1.compute.amazonaws.com:3000


COPY . /usr/app 


RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]