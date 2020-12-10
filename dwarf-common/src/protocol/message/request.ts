import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Request)
export class Request {
    @Field()
    id: string;

    @Field()
    name!: string;

    @Field()
    op!: string;

    @Field()
    payload!: any;

    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}