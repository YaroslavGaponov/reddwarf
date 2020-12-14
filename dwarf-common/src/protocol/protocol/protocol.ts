import { Schema, SchemaNode } from "../schema";
import { getSchema } from "../decorator";
import { FieldType, MessageType } from "../type";
import { Decoder } from "./decoder";
import { Encoder } from "./encoder";
import { ProtocolDecodeError } from "../error";

export class Protocol<T> {

    public static readonly VERSION = 0;
    private readonly schema: Schema;

    constructor(private readonly ctor: { new(): T }) {
        this.schema = getSchema(ctor);
    }

    static getMessageType(b: Buffer): MessageType {
        const decoder = new Decoder(b);
        const version = decoder.read(FieldType.Number);
        if (version !== Protocol.VERSION) {
            throw new ProtocolDecodeError(`Version ${version} is not correct.`);
        }
        return decoder.read(FieldType.Number);
    }

    encode(o: any): Buffer {
        const encoder = new Encoder();

        encoder.write(FieldType.Number, Protocol.VERSION);
        encoder.write(FieldType.Number, this.schema.getType());

        this.schema.getFields().forEach((e: SchemaNode) => encoder.write(e.type, o[e.name]));

        return encoder.raw();
    }

    decode(b: Buffer): any {
        const decode = new Decoder(b);

        const o = new this.ctor() as any;
        const version = decode.read(FieldType.Number);
        if (version !== Protocol.VERSION) {
            throw new ProtocolDecodeError(`Version ${version} is not correct.`);
        }
        o.type = decode.read(FieldType.Number);

        return this.schema.getFields().reduce((o: any, e: SchemaNode) => {
            o[e.name] = decode.read(e.type);
            return o;
        }, o);
    }

}