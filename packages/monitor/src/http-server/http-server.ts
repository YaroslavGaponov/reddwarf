import express from "express";
import { INetworkServer } from "../interface";
import { Client, IAccess, ILogger, Logger, Setting } from "red-dwarf-sdk";
import WebSocket, { Server as WSServer } from "ws";
import { createServer, Server as HTTPServer } from "http";
import Eyebeam from "eyebeam";


export class HttpServer implements INetworkServer {

    @Logger
    private readonly logger!: ILogger;

    @Setting("PORT", 38081)
    private readonly port!: number;


    @Client("monitor", "<empty>")
    private readonly client!: IAccess;

    private readonly app = express();
    private readonly server: HTTPServer;
    private readonly wss: WSServer;

    private readonly clients: Set<WebSocket> = new Set();
    private readonly metrics: Map<string, string> = new Map();

    constructor(www: string) {

        this.server = createServer(this.app);
        this.wss = new WSServer({ server: this.server, path: "/ws" });
        this.wss.on('connection', (client: WebSocket) => {
            this.clients.add(client);
            client.once("close", () => this.clients.delete(client));
        });

        // request/response
        this.app.get("/request", async (req, res) => {
            const response = await this.client.request(req.query.name as string, req.query.method as string, JSON.parse(req.query.payload as string));
            res.json(response);
        });

        // static www
        this.app.use("/", express.static(www));

        // metrics
        this.app.get("/metrics/:id", (req, res) => {
            const { id } = req.params;
            res.set("Content-Type", "text/plain");
            return this.metrics.has(id) ? res.end(this.metrics.get(id)) : res.end();
        });
        this.app.get("/eyebeam/:id", (req, res) => {
            const { id } = req.params;
            if (!this.metrics.has(id)) {
                this.client.subscribe(`metrics:${id}`, (channel: string, payload: any) => this.metrics.set(id, payload.raw));
            }
            return Eyebeam.handler({ url: "/metrics/" + id, interval: 3000 })(req, res);
        });
    }

    async start(): Promise<void> {
        this.logger.info(`Monitor service is starting at http://0.0.0.0:${this.port}`);
        await this.client.connect();
        await this.client.subscribe("discovery:update", (channel: string, registry: any) => this.clients.forEach(client => client.send(JSON.stringify(registry))));
        return new Promise(resolve => this.server.listen(this.port, resolve));
    }

    async stop(): Promise<void> {
        await this.client.disconnect();
    }

}