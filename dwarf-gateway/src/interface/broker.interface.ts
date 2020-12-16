export enum ChannelType {
    "queue",
    "topic"
}

export interface IBroker {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    subscribe(type: ChannelType, name: string, handler: Function): boolean;
    unsubscribe(type: ChannelType, name: string, handler: Function): boolean;
    send(type: ChannelType, name: string, payload: any): boolean;
}