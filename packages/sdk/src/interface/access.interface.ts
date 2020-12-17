import { IMethodInfo } from "red-dwarf-common";

export interface IAccess {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    register(name: string, info: IMethodInfo[], service: any): Promise<void>;
    unregister(name: string): Promise<void>;
    request(name: string, op: string, payload: any): Promise<any>;
    subscribe(channel: string, handler: Function): Promise<void>;
    unsubscribe(channel: string, handler: Function): Promise<void>;
    notify(channel: string, payload: any): Promise<void>;
}