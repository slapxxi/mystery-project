FROM node:12.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

CMD [ "npm", "start" ]