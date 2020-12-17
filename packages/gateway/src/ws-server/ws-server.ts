import { createServer } from "https";
import { IncomingMessage } from "http";
import WebSocket, { Data, Server } from "ws";
import { Client } from "../client";
import { IClient, INetworkServer } from "../interface";
import { Logger, ILogger } from "red-dwarf-common";
import { readFileSync } from "fs";
import { resolve, join } from "path";

const CERTIFICATES = resolve(__dirname, "../..", "certificates");
const KEY = readFileSync(join(CERTIFICATES, "gateway.key"));
const CERT = readFileSync(join(CERTIFICATES, "gateway.cert"));

export class WSServer implements INetworkServer {

    @Logger
    private readonly logger!: ILogger;

    private readonly server = createServer({ key: KEY, cert: CERT });
    private readonly clients: Set<IClient> = new Set();

    constructor(private readonly port: number) {
        const wss = new Server({ server: this.server });
        wss.on("connection", (socket: WebSocket, request: IncomingMessage) => {
            const client = new Client(socket, request);
            this.clients.add(client);
            socket
                .on("message", (data: Data) => {
                    client.onMessage(data as Buffer);
                })
                .once("close", () => {
                    this.clients.delete(client);
                    client.close();
                });
        });
    }

    start(): Promise<void> {
        this.logger.info("WebSocket server is starting 👍");
        return new Promise((resolve, reject) => this.server.listen(this.port, () => resolve()));
    }

    stop(): Promise<void> {
        this.logger.info("WebSocket server is stopping 👎");
        return new Promise(resolve => this.server.close(err => resolve()));
    }

}