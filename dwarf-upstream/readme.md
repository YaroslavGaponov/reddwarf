Dwarf upstream
=======
core component


# Sections

* [Overview](#overview)
* [Environment variables](#evironment-variables)
* [How to try](#how-to-try)
    * [Method GET](#method-get)
    * [Methid POST](#method-post)

# Overview

Upstream service exposes Dwarf API as REST API

# Environment variables

| Name 	            | Default 	| Description  	|
|---------------	|---------	|--------------	|
| GATEWAY_HOST      | localhost | Gateway host  |
| GATEWAY_PORT      | 38080     | Gateway port  |
| PORT          	| 38082    	| Upstream port |



# How to try

## Method GET

```sh
curl -X GET http://localhost:38082/upstream/dwarf-demo/reverse?str=Hello
```

```output
{"str":"olleH"}
```

## Method POST

```sh
curl -X POST http://localhost:38082/upstream/dwarf-demo/reverse -d '{"str": "Upstream test"}'  -H "Content-Type: application/json"
curl -X POST  http://localhost:38082/upstream/dwarf-demo/rreverse -d '{"str": "Upstream test"}'  -H "Content-Type: application/json"
```

```output
{"str":"tset maertspU"}
{"str":"Upstream test"}
```