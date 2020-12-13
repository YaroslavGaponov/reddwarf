import { ProtocolError } from "./protocol-error";

export class ProtocolEncodeError extends ProtocolError {
    constructor(message: string) {
        super("PROTOCOL_ENCODE_ERROR", message);
    }
}