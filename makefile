start:
	docker-compose up --build

stop:
	docker-compose down

monitor:
	open http://localhost:8081/