#!/bin/bash -eu

docker-compose exec node ./node_modules/.bin/apidoc -i controllers -o public/doc
