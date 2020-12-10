import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Ok)
export class Ok {

    @Field()
    id: string;
    
    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}