# graphql-chat-app

## Build docker container api

docker build -t graphql-chat-app -f Dockerfile.api .
docker run -p 9000:9000 graphql-chat-app

## Build docker container frontend

docker build -t chat-client -f Dockerfile.client .
docker run -p 3000:3000 chat-client

## Docker-Compose both

docker-compose build --no-cache

## Start api and app with compose

docker-compose up

## Shut down api and app with compose
