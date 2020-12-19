import { Message, Field } from "../decorator";
import { MessageType } from "../type";

@Message(MessageType.Metrics)
export class Metrics {

    @Field()
    id: string = Math.random().toString(36).slice(2);

    @Field()
    raw!: string;
}