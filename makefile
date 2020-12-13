start:
	docker-compose build
	docker-compose up

stop:
	docker-compose down

monitor:
	open http://localhost:8081/