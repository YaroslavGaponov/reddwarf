import { createServer } from "http";
import WebSocket, { Server } from "ws";
import { Client } from "../client";
import { INetworkServer } from "../interface";
import {Logger, ILogger} from "dwarf-common";

export class WSServer implements INetworkServer {

    @Logger
    private readonly logger!: ILogger;

    private readonly server = createServer();
    private readonly clients: Set<Client> = new Set();

    constructor(private readonly port: number) {
        const wss = new Server({ server: this.server });
        wss.on("connection", (socket: WebSocket) => this.clients.add(new Client(socket)));
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