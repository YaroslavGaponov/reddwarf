import WebSocket, { Data } from "ws";
import { Login, Logout, Fail, Ok, ProtocolManager, Register, Unregister, ILogger, Logger, MessageType } from "dwarf-common";
import { IBroker } from "../interface/broker.interface";
import { Broker } from "../decorator";

export class Client {

    @Logger
    private readonly logger!: ILogger;

    @Broker
    private readonly broker!: IBroker;

    private readonly id: String = Math.random().toString(36).slice(2);
    private readonly protocol = new ProtocolManager();

    constructor(private readonly socket: WebSocket) {

        this.logger.debug(`New client:${this.id} is connected 🤝`);

        const reply = (data: Buffer) => {
            this.logger.trace(`Sent response client:${this.id} type:${ProtocolManager.getMessageType(data)} 👉`);
            this.socket.send(data);
        }

        this.socket.on("message", (data: Data) => {

            const request = this.protocol.decode(data as Buffer);
            let response = null;

            this.logger.trace(`Received request client:${this.id} type:${request.type} 👈`);

            switch (request.type) {

                case MessageType.Login:
                    response = new Ok(request.id);
                    break;

                case MessageType.Logout:
                    response = new Ok(request.id);
                    break;

                case MessageType.Register:
                    this.broker.subscribe(`service:${request.name}`, reply);
                    this.broker.broadcast(`discovery:register`, { id: this.id, name: request.name, info: request.info });
                    response = new Ok(request.id);
                    break;

                case MessageType.Unregister:
                    this.broker.unsubscribe(`service:${request.name}`, reply);
                    this.broker.broadcast(`discovery:unregister`, { id: this.id, name: request.name });
                    response = new Ok(request.id);
                    break;

                case MessageType.Request:
                    this.broker.subscribe(`response:${request.id}`, reply);
                    this.broker.send(`service:${request.name}`, data);
                    break;

                case MessageType.Response:
                    this.broker.send(`response:${request.id}`, data);
                    break;


                case MessageType.Subscribe:
                    this.broker.subscribe(request.channel, reply);
                    response = new Ok(request.id);
                    break;

                case MessageType.Unsubscribe:
                    this.broker.unsubscribe(request.channel, reply);
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
                reply(this.protocol.encode(response) as Buffer);
            }
        });
    }

}