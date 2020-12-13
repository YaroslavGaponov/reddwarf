import { FieldType, MessageType } from "../type";
import { SchemaNode } from "./schema-node";

export class Schema {

    private type: MessageType = MessageType.Unknown;
    private readonly fields: SchemaNode[] = [];

    setType(type: MessageType): this {
        this.type = type;
        return this;
    }

    getType(): MessageType {
        return this.type;
    }

    getFields(): SchemaNode[] {
        return this.fields;
    }

    addField(type: FieldType, name: string): this {
        this.fields.push({ type, name } as SchemaNode);
        return this;
    }
}