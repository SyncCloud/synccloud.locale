#!/bin/sh
set -e

image=synccloud-locale
container=locale


# npm run build
mkdir -p ./build
git archive HEAD | tar -x -C build
cp -r ./dist ./build
cd ./build
docker build --rm -t $image ./
docker kill $container
docker rm $container
docker run \
  -d -p 3005:80 \
  -e PORT=80
  -e DEBUG=synccloud* \
  --name $container $image
cd -  