Dwarf demo typescript
=========
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

```typescript
// demo-service.ts

@Service("dwarf-demo")
@Auth("demo-service-typescript", "<empty>")
export class DemoService {

    @Logger
    private readonly logger!: ILogger;

    @Client("demo-service-typescript", "<empty>")
    private readonly client!: IAccess;

    @Method({
        name: "reverse",
        description: "Reverse string",
        examples: [{
            name: "simple1",
            payload: {
                str: "hello"
            }
        }]
    })
    async reverse(payload: ReverseInput): Promise<ReverseOutput> {
        this.logger.debug("reverse method is called");
        return { str: payload.str.split('').reverse().join('') };
    }
}

// demo-service-run.ts
const service = new DemoService();
const serviceHost = new ServiceHost(service);
await serviceHost.start();
```

## Run

```sh
npm i
npx tsc
npm run service
```

# Dwarf client

## Source

```typescript
// demo-client.ts
export class DemoClient {

    @Client("demo-client", "<empty>")
    private readonly client!: IAccess;

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.disconnect();
    }

    private onNotification(channel: string, payload: any) {
        console.log(`notification: channel=${channel} payload=${JSON.stringify(payload)}`);
    }

    async run() {

        // 1. request/response functionality
        const response = await this.client.request("dwarf-demo", "reverse", { str: "hello world 123" });
        console.log(`response: payload=${JSON.stringify(response)}`);

        // 2. notification functionality
        await this.client.subscribe("channelTest", this.onNotification);
        await this.client.notify("channelTest", { "hello": "hello world" });
        await this.client.unsubscribe("channelTest", this.onNotification);

    }
}

// demo-client-run
const client = new DemoClient();
await client.connect();
await client.run();
await client.disconnect();
```

## Run

```sh
npm i
npx tsc
npm run client
```