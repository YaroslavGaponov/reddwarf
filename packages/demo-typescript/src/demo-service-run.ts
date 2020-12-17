import { ServiceHost } from "red-dwarf-sdk";
import { DemoService } from "./demo-service";

(async () => {
    const service = new DemoService();
    const serviceHost = new ServiceHost(service);
    await serviceHost.start();
    process.once("SIGINT", async () => await serviceHost.stop());
})();