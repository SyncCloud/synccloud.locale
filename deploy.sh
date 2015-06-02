#!/bin/sh
set -e

image=synccloud-locale
container=locale


# npm run build
rm -rf ./build
mkdir -p ./build
git archive HEAD | tar -x -C build
cp -r ./dist ./build
cd ./build
npm i --production
docker build --rm -t $image ./
# docker kill $container &>/dev/null
# docker rm $container &>/dev/null
docker run \
  -d -p 3060:80 \
  -e PORT=80 \
  -e DEBUG=synccloud* \
  --name $container $image
cd -  