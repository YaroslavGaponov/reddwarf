import { AccessOptions } from "./access-options";
import WebSocket, { Data } from "ws";
import { ProtocolManager, Login, Logout, Register, Request, Response, Unregister, Ok, Logger, ILogger, Subscribe, Unsubscribe, Notify, MessageType, Fail, IMethodInfo } from "dwarf-common";
import { IAccess } from "../interface";
import { captureRejectionSymbol } from "events";

export class Access implements IAccess {

    @Logger
    private readonly logger!: ILogger;

    private client: WebSocket | undefined;
    private protocol = new ProtocolManager();

    private readonly services: Map<string, any> = new Map();
    private readonly subscribers: Map<string, Set<Function>> = new Map();
    private readonly replies: Map<string, Function> = new Map();

    constructor(private readonly options: AccessOptions) { }

    async connect(): Promise<void> {
        await this.open();
        this.logger.debug(`Client is connected to gateway 👍`);
        await this.login();
        this.logger.debug("Client is logged in 👌");
    }

    async disconnect(): Promise<void> {
        await this.logout();
        this.logger.debug("Client is logged out 🤚");
        await this.close();
        this.logger.debug("Client is disconnected from gateway 👎 ");
    }

    register(name: string, info: IMethodInfo[], service: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const gag = info.reduce(
                (o: any, method: IMethodInfo) => {
                    const { name } = method;
                    if (name) {
                        const handler = service[method.method ?? name];
                        if (handler) {
                            o[name] = handler.bind(service);
                        }
                    }
                    return o;
                }, Object.create(null));
            this.services.set(name, gag);
            const reqister = new Register();
            reqister.name = name;
            reqister.info = info;
            const packet = this.protocol.encode(reqister);
            this.replies.set(reqister.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    unregister(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.services.delete(name);
            const unreqister = new Unregister();
            unreqister.name = name;
            const packet = this.protocol.encode(unreqister);
            this.replies.set(unreqister.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    request(name: string, op: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = new Request();
            request.name = name;
            request.op = op;
            request.payload = payload;
            const packet = this.protocol.encode(request);
            this.replies.set(request.id, (m: Response | Fail) => m instanceof Response ? resolve(m.payload) : reject(m.reason));
            this.client?.send(packet);
        });
    }

    subscribe(channel: string, handler: Function): Promise<void> {
        return new Promise((resolve, reject) => {

            const handlers = this.subscribers.get(channel) || new Set();
            handlers.add(handler);
            this.subscribers.set(channel, handlers);

            const subscribe = new Subscribe();
            subscribe.channel = channel;
            const packet = this.protocol.encode(subscribe);
            this.replies.set(subscribe.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    unsubscribe(channel: string, handler: Function): Promise<void> {
        return new Promise((resolve, reject) => {

            const handlers = this.subscribers.get(channel);
            if (handlers) {
                handlers.delete(handler);
            }
            const unsubscribe = new Unsubscribe();
            unsubscribe.channel = channel;
            const packet = this.protocol.encode(unsubscribe);
            this.replies.set(unsubscribe.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    notify(channel: string, payload: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const notify = new Notify();
            notify.channel = channel;
            notify.payload = payload;
            const packet = this.protocol.encode(notify);
            this.replies.set(notify.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    private open(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new WebSocket(`ws://${this.options.host}:${this.options.port}/gateway`);
            this.client
                .once("open", resolve)
                .once("error", reject)
                .on("message", this.dispatcher.bind(this));
        });
    }

    private dispatcher(data: Data): any {

        const message = this.protocol.decode(data as Buffer);

        switch (message.type) {
            case MessageType.Request: return this.onRequest(message);
            case MessageType.Notify: return this.onNotify(message);
            default:
                if (this.replies.has(message.id)) {
                    const handler = this.replies.get(message.id);
                    this.replies.delete(message.id);
                    if (handler) {
                        handler(message);
                    }
                } else {
                    this.logger.warn(`Client does not found handler for ${JSON.stringify(message)} 😱`);
                }
        }
    }

    private login(): Promise<void> {
        return new Promise((resolve, reject) => {
            const login = new Login();
            login.applicationId = this.options.applicationId;
            login.secretKey = this.options.secretKey;
            const packet = this.protocol.encode(login);
            this.replies.set(login.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    private logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            const logout = new Logout();
            const packet = this.protocol.encode(logout);
            this.replies.set(logout.id, (m: Ok | Fail) => m instanceof Ok ? resolve() : reject(m.reason));
            this.client?.send(packet);
        });
    }

    private close() {
        this.client?.close();
    }

    private async onRequest(request: Request) {
        const { id, name, op, payload } = request;
        this.logger.debug(`request ${name}.${op}: ${JSON.stringify(payload)}`);
        try {
            const service = this.services.get(name);
            const result = await service[op](payload);
            const response = new Response(id);
            response.name = name;
            response.op = op;
            response.payload = result;
            const packet = this.protocol.encode(response);
            this.client?.send(packet);
        } catch (ex) {
            this.logger.error(ex.toString());
            const fail = new Fail(id, ex.toString());
            const packet = this.protocol.encode(fail);
            this.client?.send(packet);
        }
    }

    private onNotify(notify: Notify) {
        const { channel, payload } = notify;
        const handlers = this.subscribers.get(channel);
        handlers?.forEach((handler: Function) => handler(channel, payload));
    }

}