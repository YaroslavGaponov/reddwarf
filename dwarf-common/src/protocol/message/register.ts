import { Message, Field } from "../decorator";
import { MessageType } from "../type";

export interface IMethodExample {
    name: string;
    payload: any;
}

export interface IMethodInfo {
    name?: string;
    description?: string;
    examples?: IMethodExample[];
    method?: string;
}

@Message(MessageType.Register)
export class Register {
    @Field()
    id: string;

    @Field()
    name!: string;

    @Field()
    info!: IMethodInfo[];

    constructor(id: string = Math.random().toString(36).slice(2)) {
        this.id = id;
    }
}