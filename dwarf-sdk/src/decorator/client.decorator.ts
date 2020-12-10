import { AccessFactory } from "../access"

export function Client(applicationId: string, secretKey: string) {
    return (target:any, key: string) => {
        target[key] = AccessFactory.create(applicationId, secretKey);
    }
}