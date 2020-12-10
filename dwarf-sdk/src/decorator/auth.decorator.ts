import { AccessOptions } from "../access";

const AUTH_KEY = Symbol.for("auth");

export function Auth(applicationId: string, secretKey: string) {
    return (ctor: any) => {
        ctor[AUTH_KEY] = {applicationId, secretKey};
    }
}

export function getAuth(o: any) : AccessOptions {
    return o.constructor[AUTH_KEY];
}