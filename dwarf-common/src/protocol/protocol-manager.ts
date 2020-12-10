import { Protocol } from "./protocol";
import { Fail, Login, Logout, Notify, Ok, Register, Subscribe, Unregister, Unsubscribe, Request, Response } from "./message";
import { getMessageType } from "./decorator";

export class ProtocolManager {

    private readonly messages: Map<string, any> = new Map();


    constructor() {
        this.addMessage(Login)
            .addMessage(Logout)
            .addMessage(Ok)
            .addMessage(Fail)
            .addMessage(Register)
            .addMessage(Unregister)
            .addMessage(Request)
            .addMessage(Response)
            .addMessage(Subscribe)
            .addMessage(Unsubscribe)
            .addMessage(Notify)
            ;
    }

    addMessage(ctor: any): this {
        this.messages.set(getMessageType(ctor), new Protocol(ctor));
        return this;
    }

    static getMessageType(b: Buffer): string {
        return Protocol.getMessageType(b);
    }

    decode(b: Buffer): any {
        const type = Protocol.getMessageType(b);
        if (this.messages.has(type)) {
            const p = this.messages.get(type);
            return p.decode(b);
        }
    }

    encode(o: any): Buffer | undefined {
        const type = getMessageType(o.constructor);
        if (this.messages.has(type)) {
            const p = this.messages.get(type);
            return p.encode(o);
        }
        throw new Error("Message is not supported");
    }
}