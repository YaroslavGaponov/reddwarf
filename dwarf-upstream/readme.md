Dwarf upstream
=======
expose Dwarf API as REST API


# Call Demo service method via REST API

## Request

```sh
curl http://localhost:8082/upstream/demo/reverse -d '{"str": "Upstream test"}'  -H "Content-Type: application/json"
```

## Response

```output
{"str":"tset maertspU"}
```