import { HttpServer } from "./http-server";

(async () => {
    const httpServer = new HttpServer();
    await httpServer.start();
    process.once("SIGINT", async () => await httpServer.stop());
})()