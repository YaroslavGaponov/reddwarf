import { IMethodInfo } from "red-dwarf-common";

export interface IAccessInfo {
    applicationId: string;
    gateway: string;
    host: string;
}

export interface IServiceInfo {
    info: IMethodInfo[],
    access: { [id: string]: IAccessInfo };
}

export interface IRegistry {
    [name: string]: IServiceInfo;
}