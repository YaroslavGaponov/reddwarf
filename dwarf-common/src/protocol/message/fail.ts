import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Fail)
export class Fail {

    @Field()
    id: string;

    @Field()
    reason: string;

    constructor(id: string = Math.random().toString(36).slice(2), reason: string = "unknown") {
        this.id = id;
        this.reason = reason;
    }
}