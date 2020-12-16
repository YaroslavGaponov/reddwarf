import { ChannelType, IBroker } from "../../interface/broker.interface";

export class LocalBroker implements IBroker {

    private readonly queue: Map<string, Set<Function>> = new Map();
    private readonly topic: Map<string, Set<Function>> = new Map();

    async connect(): Promise<void> { }
    async disconnect(): Promise<void> { }

    subscribe(type: ChannelType, name: string, handler: Function): boolean {
        const subscribers = type === ChannelType.queue ? this.queue : this.topic;

        const handlers = subscribers.get(name) || new Set();
        handlers.add(handler);
        subscribers.set(name, handlers);
        return true;
    }

    unsubscribe(type: ChannelType, name: string, handler: Function): boolean {
        const subscribers = type === ChannelType.queue ? this.queue : this.topic;

        const handlers = subscribers.get(name);
        if (handlers) {
            return handlers.delete(handler);
        }
        return false;
    }

    send(type: ChannelType, name: string, payload: any): boolean {
        return type === ChannelType.queue ? this.sendToQueue(name, payload) : this.sendToTopic(name, payload);
    }


    private sendToQueue(name: string, payload: any): boolean {
        const handlers = this.queue.get(name);
        if (handlers && handlers.size > 0) {
            const handler = [...handlers][Math.floor(Math.random() * handlers.size)];
            handler(payload);
            return true;
        }
        return false;
    }

    private sendToTopic(name: string, payload: any): boolean {
        const handlers = this.topic.get(name);
        if (handlers && handlers.size > 0) {
            handlers.forEach((handler: Function) => handler(payload));
            return true;
        }
        return false;
    }

}