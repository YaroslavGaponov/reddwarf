import { DemoClient } from "./demo-client";

(async () => {
    const client = new DemoClient();
    await client.connect();
    await client.run();
    await client.disconnect();
})();