import { FieldType } from "../type";

export class Decoder {

    private cursor = 0;

    constructor(private readonly packet: Buffer) { }

    read(type: FieldType): boolean | number | string | Buffer | any {
        switch (type) {
            case FieldType.Boolean: return this.bool();
            case FieldType.Number: return this.int();
            case FieldType.String: return this.str();
            case FieldType.Buffer: return this.buf();
            case FieldType.Object: return this.json();
        }
    }

    bool(): boolean {
        const n = this.packet.readInt8(this.cursor);
        this.cursor++;
        return n ? true : false;
    }

    int(): number {
        const n = this.packet.readInt32BE(this.cursor);
        this.cursor += 4;
        return n;
    }

    uint(): number {
        const n = this.packet.readUInt32BE(this.cursor);
        this.cursor += 4;
        return n;
    }

    str(): string {
        const length = this.uint();
        const n = this.packet.subarray(this.cursor, this.cursor + length);
        this.cursor += length;
        return n.toString();
    }

    buf(): Buffer {
        const length = this.uint();
        const n = this.packet.subarray(this.cursor, this.cursor + length);
        this.cursor += length;
        return n;
    }

    json(): any {
        const length = this.uint();
        const n = this.packet.subarray(this.cursor, this.cursor + length);
        this.cursor += length;
        return JSON.parse(n.toString());
    }
}