#!/bin/sh
docker run -d -p 3000:3000 --rm --name server --env-file .env slavapavlutin/next