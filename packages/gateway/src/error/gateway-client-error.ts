import { GatewayError } from "./gateway-error";

export class GatewayClientError extends GatewayError {
    constructor(message:string) {
        super("GATEWAY_CLIENT_ERROR", message);
    }
}