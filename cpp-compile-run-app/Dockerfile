FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y g++

EXPOSE 5005

CMD ["node", "index.js"]