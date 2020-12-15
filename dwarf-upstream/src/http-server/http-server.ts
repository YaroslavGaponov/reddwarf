import express from "express";
import bodyParser from "body-parser";
import { INetworkServer } from "../interface";
import { Client, IAccess, ILogger, Logger, Setting } from "dwarf-sdk";

export class HttpServer implements INetworkServer {

    @Logger
    private readonly logger!: ILogger;

    @Setting("PORT", 38082)
    private readonly port!: number;


    @Client("upstream", "secret")
    private readonly client!: IAccess;

    private readonly app = express();

    constructor() {
        this.app.use(bodyParser.json());

        this.app.get("/upstream/:name/:method", async (req, res) => {
            try {
                const { name, method } = req.params;
                this.logger.trace(`request: ${name}.${method}: ${JSON.stringify(req.query)}`);
                const response = await this.client.request(name as string, method as string, req.query);
                res.json(response);
            } catch (ex) {
                res.status(500).send(ex);
            }
        });

        this.app.post("/upstream/:name/:method", async (req, res) => {
            try {
                const { name, method } = req.params;
                this.logger.trace(`request: ${name}.${method}: ${JSON.stringify(req.body)}`);
                const response = await this.client.request(name as string, method as string, req.body);
                res.json(response);
            } catch (ex) {
                res.status(500).send(ex);
            }
        })
    }

    async start(): Promise<void> {
        this.logger.info(`Upstream service is starting at http://0.0.0.0:${this.port}`);
        await this.client.connect();
        return new Promise(resolve => this.app.listen(this.port, resolve));
    }

    async stop(): Promise<void> {
        await this.client.disconnect();
    }

}