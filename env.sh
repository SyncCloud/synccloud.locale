#!/bin/bash

container_name=sc-locale
image_name=quay.io/ndelitski/synccloud-locale
vol_id=vol-2db1ef2a
instance_id=$(/opt/aws/bin/ec2-metadata --instance-id | cut -c14-)

run_app() {
	docker run -d -p 80:80 \
		--link mongodb:mongodb \
		-e DEBUG=synccloud* \
		-e MONGO_HOST=mongodb \
		--name $container_name \
		$image_name /sbin/my_init --
}

case "$1" in
		start)
		yum install -y docker
		service docker start

		#mount data volume
		aws configure set region eu-west-1
		aws ec2 attach-volume --volume-id $vol_id --instance-id $instance_id --device /dev/xvdf
		mkdir -p /data
		sleep 30
		mount /dev/xvdf /data

		#pull and run docker contaienrs
		aws s3 cp s3://synccloud-deployments/.dockercfg ~/.dockercfg

		docker pull dockerfile/mongodb
		docker run -d -p 27017:27017 -v /data:/data/db --name mongodb dockerfile/mongodb

		docker pull $image_name
		run_app
		;;
	update)
		docker kill $container_name
		docker rm $container_name
		docker pull $image_name
		run_app
		;;
esac


