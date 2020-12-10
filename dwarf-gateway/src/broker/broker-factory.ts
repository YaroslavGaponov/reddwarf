import { IBroker } from "../interface/broker.interface";
import { Broker } from "./broker";

export class BrokerFactory {

    static instance: IBroker;

    static create() {
        if (!BrokerFactory.instance) {
            BrokerFactory.instance = new Broker();
        }
        return BrokerFactory.instance;
    }
}