Dwarf
========
tiny microservice framework

# Sections

* [Overview](#overview)
* [General schema](#general-schema)
* [Supported languages](#supported-languages)
* [Supported message brokers](#supported-message-brokers)
* [How to try](#how-to-try)
  * [Required](#required)
  * [Build core components](#build-core-components)
  * [Start core components](#start-core-components)
  * [Open monitor](#open-monitor)
  * [REST access](#rest-access)
  * [Stop core components](#stop-core-components)
* [Core components](#core-components)
  * [Gateway](#gateway)
    * [Wherefore](#wherefore)
  * [Monitor](#monitor)
    * [Wherefore](#wherefore-1)
  * [Upstream](#upstream)
    * [Wherefore](#wherefore-2)

# Overview

The goal of this framework is to create a convenient and flexible platform for developing microservices in different languages.

# General schema

![Dwarf](/_resource/dwarf.png)

# Supported languages

  - [Node.js (Typescript)](dwarf-demo-typescript/readme.md)
  - [Node.js (Javascript)](dwarf-demo-nodejs/readme.md)
  - ...

# Supported message brokers

  - local
  - ...

# How to try

## Required

 - docker
 - docker-compose
 - make

## Build core components

```
make build
```

## Start core components

```sh
make start
```
  
![Dwarf start](/_resource/dwarf-start.png)

## Open monitor

Open `http://localhost:38081/`

or

```sh
make monitor
```

![Dwarf monitor](/_resource/dwarf-monitor.png)

## REST access

Open `http://localhost:38082/upstream/dwarf-demo/rreverse?str=hello`

or

```sh
curl "http://localhost:38082/upstream/dwarf-demo/reverse?str=Hello"
```

![Dwarf upstream](/_resource/dwarf-upstream.png)

## Stop core components

```sh
make stop
```

# Core components

## Gateway

### Wherefore

  * single entry point
  * simple protocol for accessing different message brokers

[Dwarf-gateway](dwarf-gateway/readme.md)

## Monitor

### Wherefore

  * сonvenient graphical interface to the system
  * quick health check of microservices

[Dwarf-monitor](dwarf-monitor/readme.md)

## Upstream

### Wherefore

  * microservices have REST protocol support out of the box

[Dwarf-upstream](dwarf-upstream/readme.md)