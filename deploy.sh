#!/bin/sh
set -e

image=synccloud-locale
container=locale
repo=quay.io/ndelitski

# npm run build
# rm -rf ./build
# mkdir -p ./build
# git archive HEAD | tar -x -C build
# cp -r ./dist ./build
# cp ./server/webpack-stats.json ./build/server
# cd ./build
# npm i --production
# docker build --rm -t $image ./
docker tag $image $repo/$image:$version
docker push $repo/$image:$version
# docker kill $container &>/dev/null
# docker rm $container &>/dev/null
# docker run \
#   -d -p 3060:80 \
#   -e PORT=80 \
#   -e MONGO="mongodb://192.168.59.103/locale" \
#   -e DEBUG=synccloud* \
#   --name $container $image
cd -