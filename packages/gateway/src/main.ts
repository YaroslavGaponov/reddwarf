import { DiscoveryService } from "./discovery";
import { WSServerFactory } from "./ws-server";

(async () => {

    const discovery = new DiscoveryService();
    await discovery.start();

    const server = WSServerFactory.create();
    await server.start();

    process.once("SIGINT", async () => await Promise.all([discovery.stop(), server.stop()]));
})()