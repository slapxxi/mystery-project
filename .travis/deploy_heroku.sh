#!/bin/sh
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
docker login -u _ --password=$HEROKU_API_KEY registry.heroku.com
heroku container:push web --app $HEROKU_APP_NAME --arg firebase_api_key=$FIREBASE_API_KEY,firebase_project_id=$FIREBASE_PROJECT_ID,firebase_auth_domain=$FIREBASE_AUTH_DOMAIN,firebase_database_url=$FIREBASE_DATABASE_URL,firebase_storage_bucket=$FIREBASE_STORAGE_BUCKET,firebase_messaging_sender_id=$FIREBASE_MESSAGING_SENDER_ID
heroku container:release web --app $HEROKU_APP_NAME