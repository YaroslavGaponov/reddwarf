import { IMethodInfo } from "dwarf-common";

export interface IAccessInfo {
    applicationId: string;
    host: string;
}

export interface IServiceInfo {
    info: IMethodInfo[],
    access: { [id: string]: IAccessInfo };
}

export interface IRegistry {
    [name: string]: IServiceInfo;
}