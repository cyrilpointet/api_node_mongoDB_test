#!/bin/bash -eu

docker-compose exec node ./node_modules/.bin/apidoc -i server/routes -o public/doc
