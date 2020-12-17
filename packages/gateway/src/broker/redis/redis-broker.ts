import { ChannelType, IBroker } from "../../interface";
import Redis, { RedisClient } from "redis";
import { RedisBrokerOptions } from "./redis-broker-options";
import { ILogger, Logger } from "red-dwarf-common";

export class RedisBroker implements IBroker {

    @Logger
    private readonly logger!: ILogger;

    private subscriber!: RedisClient;
    private publisher!: RedisClient;

    private readonly queue: Map<string, Set<Function>> = new Map();
    private readonly topic: Map<string, Set<Function>> = new Map();

    constructor(private readonly options: RedisBrokerOptions) { }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.publisher = Redis.createClient(this.options);
            this.subscriber = Redis.createClient(this.options);

            this.publisher.once("ready", () => this.subscriber.once("ready", resolve).once("error", reject)).once("error", reject);

            this.subscriber.on("message", (channel: string, payload: any) => {

                const type: ChannelType = channel.startsWith(ChannelType[ChannelType.queue]) ? ChannelType.queue : ChannelType.topic;
                const name = channel.slice(ChannelType[type].length + 1);
                const subscribers = type === ChannelType.queue ? this.queue : this.topic;
                const handlers = subscribers.get(name);
                payload = JSON.parse(payload);

                if (handlers && handlers.size > 0) {
                    switch (type) {
                        case ChannelType.queue:
                            const handler = [...handlers][Math.floor(Math.random() * handlers.size)];
                            handler(payload);
                            break;
                        case ChannelType.topic:
                            handlers.forEach((handler: Function) => handler(payload));
                            break;
                    }
                }

            });
        });
    }

    async disconnect(): Promise<void> {
        this.subscriber?.end();
    }

    subscribe(type: ChannelType, name: string, handler: Function): boolean {
        const subscribers = type === ChannelType.queue ? this.queue : this.topic;

        const handlers = subscribers.get(name) || new Set();
        handlers.add(handler);
        subscribers.set(name, handlers);

        return this.subscriber?.subscribe(`${ChannelType[type]}:${name}`);
    }

    unsubscribe(type: ChannelType, name: string, handler: Function): boolean {
        const subscribers = type === ChannelType.queue ? this.queue : this.topic;

        const handlers = subscribers.get(name);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.subscriber?.unsubscribe(`${ChannelType[type]}:${name}`);
            }
            return true;
        }
        return false;
    }

    send(type: ChannelType, name: string, payload: any): boolean {
        if (type === ChannelType.queue) {
            const handlers = this.queue.get(name);
            if (handlers && handlers.size > 0) {
                this.logger.debug(`For queue ${name} found local handler`);
                const handler = [...handlers][Math.floor(Math.random() * handlers.size)];
                handler(payload);
                return true;
            }
        }
        return this.publisher?.publish(`${ChannelType[type]}:${name}`, JSON.stringify(payload));
    }
}