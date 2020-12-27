FROM node:14.15.3

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT npm start
