# Build
FROM node:12.4.0-alpine as build

WORKDIR /usr/src/app

RUN yarn global add typescript

COPY package.json yarn.lock ./
RUN yarn install --production=true

ARG host=https://lit-hollows-93528.herokuapp.com

ENV HOST=${host}
ENV NODE_ENV=production

COPY . .

RUN yarn run build


# Server
FROM node:12.4.0-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy artifacts
COPY --from=build /usr/src/app/.next/ ./.next/
COPY --from=build /usr/src/app/build/ ./build/

# Copy regular files
COPY server/package.json server/next.config.js \
  service-account.json server/yarn.lock ./
COPY static/ ./static/

RUN yarn install

RUN adduser -D myuser
USER myuser

CMD [ "yarn", "start" ]
