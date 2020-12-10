import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Unsubscribe)
export class Unsubscribe {

    @Field()
    id: string;
    
    @Field()
    channel!: string;
    
    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}