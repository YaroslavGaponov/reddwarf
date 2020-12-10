import { Schema, SchemaNode } from "./schema";
import { Encoder, Decoder } from "./implement";
import { getSchema } from "./decorator";
import { FieldType } from "./type";

export class Protocol<T> {

    private readonly schema: Schema;

    constructor(ctor: { new(): T }) {
        this.schema = getSchema(ctor);
    }

    static getMessageType(b: Buffer): string {
        const decoder = new Decoder(b);
        return decoder.read(FieldType.String);
    }

    encode(o: any): Buffer {
        const encoder = new Encoder();

        encoder.write(FieldType.String, this.schema.getType());

        this.schema.getFields().forEach((e: SchemaNode) => encoder.write(e.type, o[e.name]));

        return encoder.raw();
    }

    decode(b: Buffer): any {
        const decode = new Decoder(b);

        const o = {} as any;
        o.type = decode.read(FieldType.String);

        return this.schema.getFields().reduce((o: any, e: SchemaNode) => {
            o[e.name] = decode.read(e.type);
            return o;
        }, o);
    }

}