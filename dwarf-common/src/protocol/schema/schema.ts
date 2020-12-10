import { FieldType } from "../type";
import { SchemaNode } from "./schema-node";

export class Schema {

    private type: string = "unknown";
    private readonly fields: SchemaNode[] = [];

    setType(type: string): this {
        this.type = type;
        return this;
    }

    getType(): string {
        return this.type;
    }

    getFields(): SchemaNode[] {
        return this.fields;
    }

    addField(type:FieldType, name:string) :this {
        this.fields.push({type, name});
        return this;
    }
}