import { Setting } from "dwarf-common";
import { IBroker } from "../interface/broker.interface";
import { LocalBroker } from "./local/local-broker";


export class BrokerFactory {

    @Setting("BROKER_TYPE", "local")
    static type: "local";

    static instance: IBroker;

    static create() {
        if (!BrokerFactory.instance) {
            switch (BrokerFactory.type) {
                case "local":
                default:
                    BrokerFactory.instance = new LocalBroker();
                    break;
            }
            BrokerFactory.instance.connect();
        }
        return BrokerFactory.instance;
    }
}