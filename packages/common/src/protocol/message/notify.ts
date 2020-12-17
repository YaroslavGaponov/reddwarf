import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Notify)
export class Notify {

    @Field()
    id: string;
    
    @Field()
    channel!: string;

    @Field()
    payload!: any;
    
    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}