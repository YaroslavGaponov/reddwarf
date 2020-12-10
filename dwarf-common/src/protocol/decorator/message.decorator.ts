import { Schema } from "../schema";
import { MessageType } from "../type";

const SCHEMA_KEY = Symbol.for("schema");

export function Message(type: MessageType) {
    return (ctor: any) => {
        const schema = ctor[SCHEMA_KEY] || new Schema();
        schema.setType(type);
        ctor[SCHEMA_KEY] = schema;

    }
}

export function Field(name?: string) {
    return (target: any, propName: string) => {
        const schema = target.constructor[SCHEMA_KEY] || new Schema();
        const type = Reflect.getMetadata("design:type", target, propName);
        schema.addField(type.name, name || propName);
        target.constructor[SCHEMA_KEY] = schema;
    }
}

export function getSchema(ctor: any) {
    return ctor[SCHEMA_KEY];
}

export function getMessageType(ctor: any) {
    return ctor[SCHEMA_KEY].getType();
}