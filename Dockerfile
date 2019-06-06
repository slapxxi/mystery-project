FROM node:12.4.0-alpine as build

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --only=production

ARG host=https://lit-hollows-93528.herokuapp.com

ENV HOST=${host}
ENV NODE_ENV=production

COPY . .

RUN npm run build


FROM node:12.4.0-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/.next/ ./.next/
COPY server.js i18n.js server/package.json server/next.config.js \
  service-account.json ./
COPY static/ ./static/

RUN npm install

RUN adduser -D myuser
USER myuser

CMD [ "npm", "start" ]
