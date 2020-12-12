
echo "Building images ..."
docker-compose build -q

echo "Starting ..."
docker-compose up
