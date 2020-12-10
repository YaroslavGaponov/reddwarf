Dwarf demo service & client
=========
examples for simple dwarf service and dwarf client


# Service

## Source
```typescript
@Service("demo")
@Auth("app", "secret")
export class DemoService {

    @Logger
    private readonly logger!: ILogger;

    @Method({
        name: "reverse",
        description: "Reverse string",
        examples: [{
            name: "simple",
            payload: {
                str: "hello"
            }
        }]
    })
    async reverse(payload: ReverseInput): Promise<ReverseOutput> {
        this.logger.trace("reverse method is called");
        return { str: payload.str.split('').reverse().join('') };
    }

}
```

## Run
```sh
npm run service
```

## Output
```output
2020-12-10T11:29:43.685Z INFO: connect to gateway is ok 👍
2020-12-10T11:29:43.688Z INFO: login is ok 👌
2020-12-10T11:29:47.169Z TRACE: reverse method is called
```

# Client

## Source
```typescript
export class DemoClient {

    @Client("app", "secret")
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

        // 1. request/response functionallity
        const response = await this.client.request("demo", "reverse", { str: "hello world 123" }); console.log(`request: payload=${JSON.stringify(response)}`);

        // 2. notification functionallity
        await this.client.subscribe("channelTest", this.onNotification);
        await this.client.notify("channelTest", { "hello": "hello world" });
        await this.client.unsubscribe("channelTest", this.onNotification);

    }
}
```

## Run
```sh
npm run client
```

## Output
```output
2020-12-10T11:29:47.165Z INFO: connect to gateway is ok 👍
2020-12-10T11:29:47.167Z INFO: login is ok 👌
request: payload={"str":"321 dlrow olleh"}
notification: channel=channelTest payload={"hello":"hello world"}
2020-12-10T11:29:47.172Z INFO: logout is ok 🤚
2020-12-10T11:29:47.173Z INFO: disconnect from gateway is ok 👎 
```