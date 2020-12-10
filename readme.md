Dwarf
========
tiny microservice framework for typescript


# Start

```sh
docker-compose build
docker-compose up
```

# Registry API

```sh
curl http://localhost:8081/registry
``

```json
{
  "demo": {
    "info": [
      {
        "name": "reverse",
        "description": "Reverse string",
        "examples": [
          {
            "name": "simple",
            "payload": {
              "str": "hello"
            }
          }
        ],
        "method": "reverse"
      }
    ],
    "access": [
      "jw5uh6wt33"
    ]
  }
}
```

# Dwarf native client

```sh
cd dwarf-demo-service
npm i
npx tsc
npm run client
```

```output
2020-12-10T21:02:46.397Z INFO: connect to gateway is ok 👍
2020-12-10T21:02:46.403Z INFO: login is ok 👌
request: payload={"str":"321 dlrow olleh"}
notification: channel=channelTest payload={"hello":"hello world"}
2020-12-10T21:02:46.425Z INFO: logout is ok 🤚
2020-12-10T21:02:46.426Z INFO: disconnect from gateway is ok 👎 
```

# Stop

```sh
docker-compose down
```

