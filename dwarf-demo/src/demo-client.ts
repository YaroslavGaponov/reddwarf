import { Client, IAccess } from "dwarf-sdk";

export class DemoClient {

    @Client("demo-client", "secret")
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
        const response = await this.client.request("dwarf-demo", "reverse", { str: "hello world 123" }); console.log(`request: payload=${JSON.stringify(response)}`);

        // 2. notification functionallity
        await this.client.subscribe("channelTest", this.onNotification);
        await this.client.notify("channelTest", { "hello": "hello world" });
        await this.client.unsubscribe("channelTest", this.onNotification);

    }
}
