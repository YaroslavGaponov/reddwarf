import WebSocket from "ws";
import { Fail, Ok, ProtocolManager, ILogger, Logger, MessageType } from "dwarf-common";
import { IBroker, IClient } from "../interface";
import { Broker } from "../decorator";
import { IncomingMessage } from "http";
import { GatewayClientError } from "../error";

export class Client implements IClient {

    @Logger
    private readonly logger!: ILogger;

    @Broker
    private readonly broker!: IBroker;

    private readonly id: String = Math.random().toString(36).slice(2);
    public readonly send: (data: Buffer) => void;
    private readonly protocol = new ProtocolManager();

    private isLoggin = false;
    private applicationId: string = "<unknown>";

    private readonly services: Set<string> = new Set();
    private readonly channels: Set<string> = new Set();

    constructor(private readonly socket: WebSocket, private readonly request: IncomingMessage) {

        this.logger.debug(`New client ${this.id} is connected 🤝`);

        this.send = ((data: Buffer) => this.socket.send(data)).bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.close = this.close.bind(this);
    }

    onMessage(data: Buffer): void {
        let request, response;

        try {
            request = this.protocol.decode(data as Buffer);

            this.logger.trace(`Received ${JSON.stringify(request)}`);

            switch (request.type) {

                case MessageType.Login:
                    this.isLoggin = true;
                    this.applicationId = request.applicationId;
                    response = new Ok(request.id);
                    break;

                case MessageType.Logout:
                    this.isLoggin = false;
                    this.applicationId = "unknown";
                    response = new Ok(request.id);
                    break;

                case MessageType.Register:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.subscribe(`service:${request.name}`, this.send);
                    this.broker.broadcast(`discovery:register`, {
                        id: this.id,
                        host: this.request.socket.remoteAddress,
                        applicationId: this.applicationId,
                        name: request.name,
                        info: request.info
                    });
                    this.services.add(request.name);
                    response = new Ok(request.id);
                    break;

                case MessageType.Unregister:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.unsubscribe(`service:${request.name}`, this.send);
                    this.broker.broadcast(`discovery:unregister`, {
                        id: this.id,
                        name: request.name
                    });
                    this.services.delete(request.name);
                    response = new Ok(request.id);
                    break;

                case MessageType.Request:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.subscribe(`response:${request.id}`, this.send);
                    if (!this.broker.send(`service:${request.name}`, data)) {
                        throw new GatewayClientError(`Service ${request.name} is not found`);
                    }
                    break;

                case MessageType.Response:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.send(`response:${request.id}`, data);
                    break;

                case MessageType.Fail:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.send(`response:${request.id}`, data);
                    break;

                case MessageType.Subscribe:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.subscribe(request.channel, this.send);
                    this.channels.add(request.channel);
                    response = new Ok(request.id);
                    break;

                case MessageType.Unsubscribe:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.unsubscribe(request.channel, this.send);
                    this.channels.delete(request.channel);
                    response = new Ok(request.id);
                    break;

                case MessageType.Notify:
                    if (!this.isLoggin) {
                        throw new GatewayClientError("Client is not logged in");
                    }
                    this.broker.broadcast(request.channel, data);
                    response = new Ok(request.id);
                    break;

                default:
                    throw new GatewayClientError("Message type is not supported");
            }

            if (response) {
                this.logger.trace(`Sent ${JSON.stringify(response)}`);
                this.send(this.protocol.encode(response) as Buffer);
            }

        } catch (ex) {
            this.logger.error(ex.toString());
            if (request && request.id) {
                const response = new Fail(request.id, ex.toString());
                this.send(this.protocol.encode(response) as Buffer);
            }
        }

    }

    close(): void {
        this.logger.debug(`Client ${this.id} is disconnected`);

        this.services.forEach((name: string) => {
            this.broker.unsubscribe(`service:${name}`, this.send);
            this.broker.broadcast(`discovery:unregister`, { id: this.id, name });
        });
        this.channels.forEach((channel: string) => this.broker.unsubscribe(channel, this.send));

        this.services.clear();
        this.channels.clear();
    }

}