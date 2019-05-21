#!/bin/sh
docker build \
  --build-arg firebase_api_key=$FIREBASE_API_KEY \
  --build-arg firebase_project_id=$FIREBASE_PROJECT_ID \
  --build-arg firebase_auth_domain=$FIREBASE_AUTH_DOMAIN \
  --build-arg firebase_database_url=$FIREBASE_DATABASE_URL \
  --build-arg firebase_storage_bucket=$FIREBASE_STORAGE_BUCKET \
  --build-arg firebase_messaging_sender_id=$FIREBASE_MESSAGING_SENDER_ID \
  -t slavapavlutin/next .
