#!/bin/bash

echo version ?
read VERSION

docker build -t dwax1324/clone-reddit:$VERSION .
docker push dwax1324/clone-reddit:$VERSION 

ssh root@158.247.211.105 "docker pull dwax1324/clone-reddit:$VERSION && docker tag dwax1324/clone-reddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"