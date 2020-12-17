import { AccessFactory } from "../access";
import { getAuth } from "../decorator";
import { IAccess } from "../interface";
import { getName, getInfo } from "../decorator";
import { IMethodInfo } from "red-dwarf-common";

export class ServiceHost {

    private readonly access: IAccess;
    private readonly name: string;
    private readonly info: IMethodInfo[];

    constructor(private readonly service: any) {
        const { applicationId, secretKey } = getAuth(service);
        this. name = getName(this.service);
        this.info = getInfo(this.service);
        this.access = AccessFactory.create(applicationId, secretKey);
    }

    async start(): Promise<void> {
        await this.access.connect();
        await this.access.register(this.name, this.info, this.service);
    }

    async stop(): Promise<void> {
        await this.access.unregister(this.name);
        await this.access.disconnect();
    }

}