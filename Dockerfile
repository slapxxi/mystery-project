FROM node:12.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ARG firebase_api_key
ARG firebase_project_id
ARG firebase_auth_domain
ARG firebase_database_url
ARG firebase_storage_bucket
ARG firebase_messaging_sender_id

ENV NODE_ENV=production

ENV FIREBASE_API_KEY=$firebase_api_key
ENV FIREBASE_PROJECT_ID=$firebase_project_id
ENV FIREBASE_AUTH_DOMAIN=$firebase_auth_domain
ENV FIREBASE_DATABASE_URL=$firebase_database_url
ENV FIREBASE_STORAGE_BUCKET=$firebase_storage_bucket
ENV FIREBASE_MESSAGING_SENDER_ID=$firebase_messaging_sender_id

COPY . .

RUN npm run build

RUN adduser -D myuser
USER myuser

CMD [ "npm", "start" ]