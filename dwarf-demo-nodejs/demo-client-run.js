
const { Access } = require("dwarf-sdk");

const options = {
    host: process.env.GATEWAY_HOST || "localhost",
    port: process.env.GATEWAY_PORT || 38080,
    applicationId: "demo-service-nodejs",
    secretKey: "<empty>"
};

(async () => {
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
})();


