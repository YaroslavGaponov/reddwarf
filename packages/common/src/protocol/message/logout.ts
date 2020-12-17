import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Logout)
export class Logout  {

    @Field()
    id: string;
 
    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}