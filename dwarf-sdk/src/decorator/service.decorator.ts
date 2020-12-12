import { IMethodInfo } from "dwarf-common";

const SERVICE_NAME_KEY = Symbol.for("name");
const SERVICE_INFO_KEY = Symbol.for("info");

export function Service(name: string) {
    return (ctor: any) => {
        ctor[SERVICE_NAME_KEY] = name;
    }
}

export function getName(o: any): string {
    return o.constructor[SERVICE_NAME_KEY];
}

export function Method(methodInfo: IMethodInfo) {
    return (target: any, key: string) => {
        const info: IMethodInfo[] = target.constructor[SERVICE_INFO_KEY] || [];
        methodInfo.name = methodInfo.name || key;
        methodInfo.description = methodInfo.description || `method ${key}`;
        methodInfo.examples = methodInfo.examples || [];
        methodInfo.method = key;
        info.push(methodInfo);
        target.constructor[SERVICE_INFO_KEY] = info;
    }
}

export function getInfo(o: any): IMethodInfo[] {
    return o.constructor[SERVICE_INFO_KEY];
}