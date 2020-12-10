import express from "express";
import { INetworkServer } from "../interface";
import { Client, IAccess, ILogger, Logger, Setting } from "dwarf-sdk";

export class HttpServer implements INetworkServer {

    @Logger
    private readonly logger!:ILogger;

    @Setting("PORT", 8081)
    private readonly port!: number;


    @Client("monitor", "secret")
    private readonly client!: IAccess;

    private registry: any = {};

    private readonly app = express();

    constructor(www:string) {
        this.app.get("/registry", (req, res) => res.json(this.registry));
        this.app.get("/request", async (req, res)=> {
            const response = await this.client.request(req.query.name as string, req.query.method as string, JSON.parse(req.query.payload as string));
            res.json(response);
        })
        this.app.use("/",express.static(www));
    }

    async start(): Promise<void> {
        this.logger.info(`Monitor service is starting at http://localhost:${this.port}`);
        await this.client.connect();
        await this.client.subscribe("discovery:update", (channel: string, registry: any) => this.registry = registry);
        return new Promise(resolve => this.app.listen(this.port, resolve));
    }

    async stop(): Promise<void> {
        await this.client.disconnect();
    }

}