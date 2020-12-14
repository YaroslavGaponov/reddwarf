import { IBroker } from "../../interface/broker.interface";

export class LocalBroker implements IBroker {

    private readonly subscribers: Map<string, Set<Function>> = new Map();

    async connect(): Promise<void> { }
    async disconnect(): Promise<void> { }

    subscribe(name: string, handler: Function): boolean {
        const handlers = this.subscribers.get(name) || new Set();
        handlers.add(handler);
        this.subscribers.set(name, handlers);
        return true;
    }

    unsubscribe(name: string, handler: Function): boolean {
        const handlers = this.subscribers.get(name);
        if (handlers) {
            return handlers.delete(handler);
        }
        return false;
    }

    send(name: string, payload: any): boolean {
        const handlers = this.subscribers.get(name);
        if (handlers && handlers.size > 0) {
            const handler = [...handlers][Math.floor(Math.random() * handlers.size)];
            handler(payload);
            return true;
        }
        return false;
    }

    broadcast(name: string, payload: any): boolean {
        const handlers = this.subscribers.get(name);
        if (handlers && handlers.size > 0) {
            handlers.forEach((handler: Function) => handler(payload));
            return true;
        }
        return false;
    }

}