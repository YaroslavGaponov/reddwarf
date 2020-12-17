
build: build-local

start: start-local
	
build-local:
	docker-compose -f docker-compose-local.yaml build

start-local: 
	docker-compose -f docker-compose-local.yaml up

stop: stop-local

stop-local: 
	docker-compose  -f docker-compose-local.yaml down

build-redis:
	docker-compose -f docker-compose-redis.yaml build

start-redis: 
	docker-compose -f docker-compose-redis.yaml up

stop-redis: 
	docker-compose -f docker-compose-redis.yaml down

monitor:
	open http://localhost:38081/