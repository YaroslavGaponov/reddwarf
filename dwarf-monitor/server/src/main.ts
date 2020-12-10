import { HttpServer } from "./http-server";
import{resolve} from "path";

(async () => {
    const httpServer = new HttpServer(resolve(__dirname, "../../ui/public"));
    await httpServer.start();
    process.once("SIGINT", async () => await httpServer.stop());
})()