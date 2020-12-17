import { ProtocolError } from "./protocol-error";

export class ProtocolDecodeError extends ProtocolError {
    constructor(message: string) {
        super("PROTOCOL_DECODE_ERROR", message);
    }
}