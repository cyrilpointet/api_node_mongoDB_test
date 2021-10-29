#!/bin/bash -eu

docker-compose exec node ./node_modules/.bin/apidoc -i routes -o public/doc
