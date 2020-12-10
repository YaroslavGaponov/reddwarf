import { BrokerFactory } from "../broker";

export function Broker(target:any, key:string) {
    target[key] = BrokerFactory.create();
}