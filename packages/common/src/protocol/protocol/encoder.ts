import { FieldType } from "../type";

export class Encoder {

    private readonly packet: Buffer[] = [];


    write(type: FieldType, value: any): this {
        switch (type) {
            case FieldType.Boolean: return this.bool(value);
            case FieldType.Number: return this.int(value);
            case FieldType.String: return this.str(value);
            case FieldType.Buffer: return this.buf(value);
            case FieldType.Object: return this.json(value);
            case FieldType.Array: return this.json(value);
        }
    }

    private bool(n: boolean): this {
        const buf = Buffer.alloc(1);
        buf.writeInt8(n ? 1 : 0);
        this.packet.push(buf);
        return this;
    }

    private int(n: number): this {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(n);
        this.packet.push(buf);
        return this;
    }

    private uint(n: number): this {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(n);
        this.packet.push(buf);
        return this;
    }

    private str(n: string): this {
        this.uint(n.length);
        const buf = Buffer.alloc(n.length);
        buf.write(n);
        this.packet.push(buf);
        return this;
    }

    private buf(n: Buffer): this {
        this.uint(n.length);
        this.packet.push(n);
        return this;
    }

    private json(n: any): this {
        const s = Buffer.from(JSON.stringify(n));
        this.uint(s.length);
        this.packet.push(s);
        return this;
    }

    raw(): Buffer {
        return Buffer.concat(this.packet);
    }
}