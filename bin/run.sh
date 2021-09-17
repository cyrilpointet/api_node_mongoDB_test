#!/bin/bash -eu

docker-compose down

ls -la .env

docker-compose up -d
docker-compose config

echo "
  _  __         _
 | |/ /        (_)
 | ' / ___ _ __ _ _ __   __ _
 |  < / _ \ '__| | '_ \ / _  |
 | . \  __/ |  | | | | | (_| |
 |_|\_\___|_|  |_|_| |_|\__, |
                         __/ |
                        |___/
"
echo "Serveur is running: http://localhost:8081"

echo "Generating API doc"
bin/apidoc.sh
echo "API doc: http://localhost:8081/doc/"

echo "Webpack is watching"
bin/webpack_watch.sh
