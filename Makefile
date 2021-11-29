NODE := docker-compose run --rm node
NODE_EXEC := docker-compose exec node

node_modules:
	$(NODE) yarn install

public:
	$(NODE) yarn build-dev

down:
	docker-compose down

run: node_modules public down
	docker-compose up -d
	bin/links.sh

logs:
	docker-compose logs -f

shell:
	$(NODE) bash

watch:
	$(NODE_EXEC) yarn watch

import:
	$(NODE) yarn import-database

quick_import:
	$(NODE) yarn quick-import-database
