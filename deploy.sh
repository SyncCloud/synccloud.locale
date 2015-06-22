#!/bin/sh
set -e

image=synccloud-locale
container=locale
repo=quay.io/ndelitski
remote_host=54.77.244.127
remote_key=~/Drive/tools.pem
remote_user=ec2-user
remote_path=/home/ec2-user
#
# Output usage information.
#

usage() {
  cat <<-EOF
  Usage: deploy [command]
  Commands:
    remote               deploy app to remote host
    local                deploy app locally using docker
EOF
}

#
# Build project files and prepare
#

build_project() {
  npm run build
  rm -rf ./build
  mkdir -p ./build
  git archive HEAD | tar -x -C build
  cp -r ./dist ./build
  cp ./server/webpack-stats.json ./build/server
  cd ./build
  npm i --production
}

#
# Return the ssh command to run
#

ssh_command() {
  local url="${remote_user}@${remote_host}"
  local key=$remote_key
  test -n "$key" && local identity="-i $key"
  test -n "$port" && local port="-p $port"
  echo "ssh $port $identity $url"
}

#
# Run command on remote
#

remote_run() {
  local shell="`ssh_command`"
  echo $shell "\"$@\""
  $shell $@
}

#
# Copy files to remote host
#

copy_to_remote() {
  local local_path=$1
  local remote_path=$2
  local key=$remote_key
  test -n "$key" && local identity="-i $key"
  scp $identity $local_path $remote_user@$remote_host:$remote_path
}

#
# Build and deploy docker image
#

deploy_docker() {
  docker build --rm -t $image ./
  docker tag $image $repo/$image:$version
  docker push $repo/$image:$version
}

#
# Update app version on remote
#

update_remote() {
  remote_run "sh env.sh update"
}

#
# Deploy app locally using docker
#

deploy_local() {
  build_project
  docker build --rm -t $image ./build
  docker kill $container
  docker rm $container
  docker run \
    -d -p 3060:80 \
    -e PORT=80 \
    -e MONGO="mongodb://192.168.59.103/locale" \
    -e DEBUG=synccloud* \
    --name $container $image
}

#
# Deploy app to remote
#

deploy_remote() {
  build_project
  deploy_docker
  copy_to_remote ./env.sh /home/ec2-user/env.sh
  update_remote
}

case $1 in
  -h|--help) usage; exit;;
  run|exec) remote_run "cd $remote_path && ${@:2}"; exit ;;
  remote) deploy_remote; exit;;
  local) deploy_local; exit;;
  *) usage; exit 1;;
esac
