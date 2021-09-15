#!/bin/bash -eu

echo "Lauch webpack watcher"

docker-compose exec node yarn watch
