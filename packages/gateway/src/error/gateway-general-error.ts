import { GatewayError } from "./gateway-error";

export class GatewayGeneralError extends GatewayError {
    constructor(message:string) {
        super("GATEWAY_GENERAL_ERROR", message);
    }
}