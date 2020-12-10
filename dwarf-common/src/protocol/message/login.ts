import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Login)
export class Login {

    @Field()
    id: string;

    @Field()
    applicationId!: string;

    @Field()
    secretKey!: string;

    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}