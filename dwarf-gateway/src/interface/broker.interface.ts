export interface IBroker {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    subscribe(name: string, handler: Function): boolean;
    unsubscribe(name: string, handler: Function): boolean;
    send(name: string, payload: any): boolean;
    broadcast(name: string, payload: any): boolean;
}