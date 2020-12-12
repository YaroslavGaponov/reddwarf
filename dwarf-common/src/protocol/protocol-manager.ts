import { Protocol } from "./protocol";
import { Fail, Login, Logout, Notify, Ok, Register, Subscribe, Unregister, Unsubscribe, Request, Response } from "./message";
import { getMessageType } from "./decorator";
import { MessageType } from "./type";

export class ProtocolManager {

    private readonly messages: any[] = [];


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
        const type = getMessageType(ctor);
        this.messages[type] = new Protocol(ctor);
        return this;
    }

    static getMessageType(b: Buffer): MessageType {
        return Protocol.getMessageType(b);
    }

    decode(b: Buffer): any {
        const type = Protocol.getMessageType(b);
        if (this.messages[type]) {
            const p = this.messages[type];
            return p.decode(b);
        }
    }

    encode(o: any): Buffer | undefined {
        const type = getMessageType(o.constructor);
        if (this.messages[type]) {
            const p = this.messages[type];
            return p.encode(o);
        }
        throw new Error("Message is not supported");
    }
}