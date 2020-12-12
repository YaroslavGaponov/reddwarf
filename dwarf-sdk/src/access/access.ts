import { AccessOptions } from "./access-options";
import WebSocket, { Data } from "ws";
import { ProtocolManager, Login, Logout, Register, Request, Response, Unregister, Logger, ILogger, Subscribe, Unsubscribe, Notify, MessageType } from "dwarf-common";
import { IAccess } from "../interface";
import {getName, getInfo} from "../decorator";

export class Access implements IAccess {

    @Logger
    private readonly logger!: ILogger;

    private client: WebSocket | undefined;
    private protocol = new ProtocolManager();

    private readonly services: Map<string, any> = new Map();
    private readonly subscribers: Map<string, Set<Function>> = new Map();
    private readonly reply: Map<string, Function> = new Map();

    constructor(private readonly options: AccessOptions) { }

    private _connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new WebSocket(`ws://${this.options.host}:${this.options.port}/gateway`);
            this.client
                .once("open", resolve)
                .once("error", reject)
                .on("message", (data: Data) => this.dispatcher(data));
        });
    }

    private async dispatcher(data: Data) {
        const message = this.protocol.decode(data as Buffer);

        switch (message.type) {

            case MessageType.Request: {
                const { id, name, op, payload } = message;
                const service = this.services.get(name);
                const response = new Response(id);
                response.name = name;
                response.op = op;
                response.payload = await service[op](payload);
                const packet = this.protocol.encode(response);
                this.client?.send(packet);
                return;
            }

            case MessageType.Notify: {
                const { channel, payload } = message;
                const handlers = this.subscribers.get(channel);
                if (handlers) {
                    handlers.forEach((handler: Function) => handler(channel, payload));
                }
                return;
            }

            default: {
                if (this.reply.has(message.id)) {
                    const handler = this.reply.get(message.id);
                    this.reply.delete(message.id);
                    if (handler) {
                        handler(message);
                    }
                } else {
                    this.logger.warn(`Client does not found handler for ${JSON.stringify(message)} 😱`);
                }
                return;
            }
        }

    }

    private _login(): Promise<void> {
        return new Promise((resolve, reject) => {
            const login = new Login();
            login.applicationId = this.options.applicationId;
            login.secretKey = this.options.secretKey;
            const packet = this.protocol.encode(login);
            this.reply.set(login.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

    async connect(): Promise<void> {
        await this._connect();
        this.logger.debug(`Client is connected to gateway 👍`);
        await this._login();
        this.logger.debug("Client is logged in 👌");
    }


    private _logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            const logout = new Logout();
            const packet = this.protocol.encode(logout);
            this.reply.set(logout.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

    private _disconnect() {
        this.client?.close();
    }

    async disconnect(): Promise<void> {
        await this._logout();
        this.logger.debug("Client is logged out 🤚");
        await this._disconnect();
        this.logger.debug("Client is disconnected from gateway 👎 ");
    }

    async register(service: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const name = getName(service);
            const info = getInfo(service);
            this.services.set(name, service);
            const reqister = new Register();
            reqister.name = name;
            reqister.info = info;
            const packet = this.protocol.encode(reqister);
            this.reply.set(reqister.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

    async unregister(service: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const name = getName(service);
            this.services.delete(name);
            const unreqister = new Unregister();
            unreqister.name =  name;
            const packet = this.protocol.encode(unreqister);
            this.reply.set(unreqister.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

    async request(name: string, op: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = new Request();
            request.name = name;
            request.op = op;
            request.payload = payload;
            const packet = this.protocol.encode(request);
            this.reply.set(request.id, (response: Response) => resolve(response.payload));
            this.client?.send(packet);
        });
    }

    async subscribe(channel: string, handler: Function): Promise<void> {
        return new Promise((resolve, reject) => {

            const handlers = this.subscribers.get(channel) || new Set();
            handlers.add(handler);
            this.subscribers.set(channel, handlers);

            const subscribe = new Subscribe();
            subscribe.channel = channel;
            const packet = this.protocol.encode(subscribe);
            this.reply.set(subscribe.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

    async unsubscribe(channel: string, handler: Function): Promise<void> {
        return new Promise((resolve, reject) => {

            const handlers = this.subscribers.get(channel);
            if (handlers) {
                handlers.delete(handler);
            }
            const unsubscribe = new Unsubscribe();
            unsubscribe.channel = channel;
            const packet = this.protocol.encode(unsubscribe);
            this.reply.set(unsubscribe.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

    async notify(channel: string, payload: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const notify = new Notify();
            notify.channel = channel;
            notify.payload = payload;
            const packet = this.protocol.encode(notify);
            this.reply.set(notify.id, (m: any) => m.type === MessageType.Ok ? resolve() : reject());
            this.client?.send(packet);
        });
    }

}