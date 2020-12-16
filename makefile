

start: start-local

start-local:
	docker-compose -f docker-compose-local.yaml up --build

stop: stop-local

stop-local:
	docker-compose  -f docker-compose-local.yaml down

start-redis:
	docker-compose -f docker-compose-redis.yaml up  --build

stop-redis:
	docker-compose -f docker-compose-redis.yaml down

monitor:
	open http://localhost:38081/