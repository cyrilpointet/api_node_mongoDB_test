#!/bin/bash -eu

echo "Launch webpack watcher"

docker-compose exec node yarn watch
