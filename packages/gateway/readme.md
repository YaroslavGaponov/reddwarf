Dwarf-Gateway
============
core component


# Sections

* [Overview](#overview)
* [Environment variables](#evironment-variables)

# Overview

Gateway is the single entry point for all clients.

# Environment variables

| Name 	             | Default 	| Description                  	  |
|------------------- |---------	|-------------------------------  |
| PORT  	         | 38080    | Gateway port 	                  |
| BROKER_TYPE        | local    | Broker type: local, redis       |
| BROKER_HOST        | localhost| Broker host                     |
| BROKER_PORT        |          | Broker port                     |
| BROKER_PASS        |          | Broker password                 |
| DISCOVERY_INTERVAL | 5000     | Interval discovery notification |