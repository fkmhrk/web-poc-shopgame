#!/bin/sh

docker run --rm -d -p 8080:80 --name tmp -v `pwd`:/usr/share/nginx/html/web-poc-shopgame:ro nginx
