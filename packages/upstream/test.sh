curl -X GET http://localhost:38082/upstream/dwarf-demo/reverse?str=Hello
curl -X POST http://localhost:38082/upstream/dwarf-demo/reverse -d '{"str": "Upstream test"}'  -H "Content-Type: application/json"
curl -X POST  http://localhost:38082/upstream/dwarf-demo/rreverse -d '{"str": "Upstream test"}'  -H "Content-Type: application/json"