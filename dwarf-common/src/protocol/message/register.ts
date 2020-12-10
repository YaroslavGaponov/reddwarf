import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Register)
export class Register {
    @Field()
    id: string;

    @Field()
    name!: string;

    @Field()
    info!: any;

    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}