import { AccessFactory } from "../access";
import { getAuth } from "../decorator";
import { IAccess } from "../interface";

export class ServiceHost {

    private readonly access: IAccess;

    constructor(private readonly service: any) {
        const { applicationId, secretKey } = getAuth(service);
        this.access = AccessFactory.create(applicationId, secretKey);
    }

    async start(): Promise<void> {
        await this.access.connect();
        await this.access.register(this.service);
    }

    async stop(): Promise<void> {
        await this.access.unregister(this.service);
        await this.access.disconnect();
    }

}