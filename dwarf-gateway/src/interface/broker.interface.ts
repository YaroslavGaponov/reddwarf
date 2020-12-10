export interface IBroker {
    subscribe(name: string, handler: Function): boolean;
    unsubscribe(name: string, handler: Function): boolean;
    send(name: string, payload: any): boolean;
    broadcast(name: string, payload: any): boolean;
}