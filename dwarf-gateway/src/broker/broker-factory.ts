import { ILogger, Logger, Setting } from "dwarf-common";
import { IBroker } from "../interface/broker.interface";
import { LocalBroker } from "./local";
import { RedisBroker } from "./redis";


export class BrokerFactory {

    @Logger
    static logger: ILogger;

    @Setting("BROKER_TYPE", "local")
    static type: "local" | "redis";

    @Setting("BROKER_HOST", "localhost")
    static host: string;

    @Setting("BROKER_PORT", 6379)
    static port: number;

    @Setting("BROKER_PASS", "")
    static password: string;

    static instance: IBroker;

    static create() {
        if (!BrokerFactory.instance) {
            switch (BrokerFactory.type) {
                case "redis":
                    const redisBrokerOptions = { host: BrokerFactory.host, port: BrokerFactory.port, password: BrokerFactory.password };
                    BrokerFactory.instance = new RedisBroker(redisBrokerOptions);
                    break;
                case "local":
                default:
                    BrokerFactory.type = "local";
                    BrokerFactory.instance = new LocalBroker();
                    break;
            }
            BrokerFactory.logger.info(`Broker ${BrokerFactory.type} is starting...`);
            BrokerFactory.instance.connect();
        }
        return BrokerFactory.instance;
    }
}