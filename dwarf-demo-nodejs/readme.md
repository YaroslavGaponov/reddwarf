Dwarf demo node.js
========
Examples

# Sections

* [Dwarf service](#dwarf-service)
    * [Source](#source)
    * [Run](#run)
* [Dwarf client](#dwarf-client)
    * [Source](#source-1)
    * [Run](#run-1)


# Dwarf service

## Source

```javascript
const NAME = "dwarf-demo";
const INFO = [
    {
        name: "reverse",
        description: "Reverse string",
        examples: [{
            name: "simple1",
            payload: {
                str: "hello"
            }
        }, {
            name: "simple2",
            payload: {
                str: "hello world 123"
            }
        }]
    }
];

class DemoService {

    constructor(access) {
        this.access = access;
    }

    reverse(payload) {
        return { str: payload.str.split('').reverse().join('') };
    }
}

const options = {
    host: process.env.GATEWAY_HOST || "localhost",
    port: process.env.GATEWAY_PORT || 38080,
    applicationId: "demo-service-nodejs",
    secretKey: "<empty>"
};

const access = new Access(options);
await access.connect();
await access.register(NAME, INFO, new DemoService(access));
```

## Run

```sh
npm i
npm run service
```

# Dwarf client

## Source

```javascript
const options = {
    host: process.env.GATEWAY_HOST || "localhost",
    port: process.env.GATEWAY_PORT || 38080,
    applicationId: "demo-service-nodejs",
    secretKey: "<empty>"
};

const access = new Access(options);
await access.connect();

// 1. request/response functionality
const response = await access.request("dwarf-demo", "reverse", { str: "hello world 123" });
console.log(`response: payload=${JSON.stringify(response)}`);

// 2. notification functionality
const onNotification = (channel, payload) => console.log(`notification: channel=${channel} payload=${JSON.stringify(payload)}`);
await access.subscribe("channelTest", onNotification);
await access.notify("channelTest", { "hello": "hello world" });
await access.unsubscribe("channelTest", onNotification);

await access.disconnect();
```

## Run

```sh
npm i
npm run client
```