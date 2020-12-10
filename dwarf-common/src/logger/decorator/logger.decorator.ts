import { LoggerFactory } from "../logger"

export function Logger(target: any, key: string) {
    target[key] = LoggerFactory.create();
}