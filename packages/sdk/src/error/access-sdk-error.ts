import { SdkError } from "./sdk-error";

export class AccessSdkError extends SdkError {
    constructor(message: string) {
        super("ACCESS_SDK_ERROR", message);
    }
}