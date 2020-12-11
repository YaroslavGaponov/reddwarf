import express from "express";
import bodyParser from "body-parser";
import { INetworkServer } from "../interface";
import { Client, IAccess, ILogger, Logger, Setting } from "dwarf-sdk";

export class HttpServer implements INetworkServer {

    @Logger
    private readonly logger!:ILogger;

    @Setting("PORT", 8082)
    private readonly port!: number;


    @Client("upstream", "secret")
    private readonly client!: IAccess;

    private readonly app = express();

    constructor() {
        this.app.use(bodyParser.json());
        this.app.post("/upstream/:name/:method", async (req, res)=> {
            const {name, method} = req.params;
            this.logger.trace(`request: ${name}.${method}: ${JSON.stringify(req.body)}`);
            const response = await this.client.request(name as string, method as string, req.body);
            res.json(response);
        })
    }

    async start(): Promise<void> {
        this.logger.info(`Upstrean service is starting at http://localhost:${this.port}`);
        await this.client.connect();
        return new Promise(resolve => this.app.listen(this.port, resolve));
    }

    async stop(): Promise<void> {
        await this.client.disconnect();
    }

}