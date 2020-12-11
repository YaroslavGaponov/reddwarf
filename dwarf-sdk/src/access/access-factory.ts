import { settings } from "cluster";
import { IAccess } from "../interface";
import { Access } from "./access";
import { Setting } from "dwarf-common";

export class AccessFactory {

    @Setting("GATEWAY_HOST", "0.0.0.0")
    static host: string;

    @Setting("GATEWAY_PORT", 8080)
    static port: number;

    static instance: IAccess;

    static create(applicationId: string, secretKey: string): IAccess {
        if (!AccessFactory.instance) {
            const options = { host: AccessFactory.host, port: AccessFactory.port, applicationId, secretKey };
            AccessFactory.instance = new Access(options);
        }
        return AccessFactory.instance;
    }
}