import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Unregister)
export class Unregister {
    @Field()
    id: string;

    @Field()
    name!: string;

    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}