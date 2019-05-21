FROM node:12.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ENV NODE_ENV=production

COPY . .

RUN npm run build

RUN adduser -D admin
USER admin

CMD [ "npm", "start" ]