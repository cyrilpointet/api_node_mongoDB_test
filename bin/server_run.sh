#!/bin/bash -eu

docker-compose down

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
echo "Server is running: http://localhost:8081"

docker-compose up
