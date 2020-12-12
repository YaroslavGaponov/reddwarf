import WebSocket, { Data } from "ws";
import { Login, Logout, Fail, Ok, ProtocolManager, Register, Unregister, ILogger, Logger, MessageType } from "dwarf-common";
import { IBroker } from "../interface/broker.interface";
import { Broker } from "../decorator";
import { IClient } from "../interface/client.interface";

export class Client implements IClient {

    @Logger
    private readonly logger!: ILogger;

    @Broker
    private readonly broker!: IBroker;

    private readonly id: String = Math.random().toString(36).slice(2);
    public readonly send: (data: Buffer) => void;
    private readonly protocol = new ProtocolManager();

    private readonly services: Set<string> = new Set();
    private readonly channels: Set<string> = new Set();

    constructor(private readonly socket: WebSocket) {

        this.logger.debug(`New client ${this.id} is connected 🤝`);

        this.send = ((data: Buffer) => this.socket.send(data)).bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.close = this.close.bind(this);

    }

    onMessage(data: Buffer): void {
        const request = this.protocol.decode(data as Buffer);
        let response = null;

        switch (request.type) {

            case MessageType.Login:
                response = new Ok(request.id);
                break;

            case MessageType.Logout:
                response = new Ok(request.id);
                break;

            case MessageType.Register:
                this.broker.subscribe(`service:${request.name}`, this.send);
                this.broker.broadcast(`discovery:register`, { id: this.id, name: request.name, info: request.info });
                this.services.add(request.name);
                response = new Ok(request.id);
                break;

            case MessageType.Unregister:
                this.broker.unsubscribe(`service:${request.name}`, this.send);
                this.broker.broadcast(`discovery:unregister`, { id: this.id, name: request.name });
                this.services.delete(request.name);
                response = new Ok(request.id);
                break;

            case MessageType.Request:
                this.broker.subscribe(`response:${request.id}`, this.send);
                this.broker.send(`service:${request.name}`, data);
                break;

            case MessageType.Response:
                this.broker.send(`response:${request.id}`, data);
                break;


            case MessageType.Subscribe:
                this.broker.subscribe(request.channel, this.send);
                this.channels.add(request.channel);
                response = new Ok(request.id);
                break;

            case MessageType.Unsubscribe:
                this.broker.unsubscribe(request.channel, this.send);
                this.channels.delete(request.channel);
                response = new Ok(request.id);
                break;

            case MessageType.Notify:
                this.broker.broadcast(request.channel, data);
                response = new Ok(request.id);
                break;

            default:
                response = new Fail(request.id);
                break;
        }

        if (response) {
            this.send(this.protocol.encode(response) as Buffer);
        }

    }

    close(): void {
        this.logger.debug(`Client ${this.id} is disconnected`);
        this.services.forEach((name: string) => {
            this.broker.unsubscribe(`service:${name}`, this.send);
            this.broker.broadcast(`discovery:unregister`, { id: this.id, name });
        });
        this.channels.forEach((channel: string) => this.broker.unsubscribe(channel, this.send));
    }

}