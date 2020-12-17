import { ILogger, Logger, Setting } from "dwarf-common";
import { GatewayGeneralError } from "../error";
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

    @Setting("BROKER_PASS", "<empty>")
    static password: string;

    static instance: IBroker;

    static create() {
        if (!BrokerFactory.instance) {
            switch (BrokerFactory.type) {
                case "redis":
                    const redisBrokerOptions = { host: BrokerFactory.host, port: BrokerFactory.port, password: BrokerFactory.password === "<empty>" ? undefined : BrokerFactory.password };
                    BrokerFactory.instance = new RedisBroker(redisBrokerOptions);
                    break;
                case "local":
                    BrokerFactory.instance = new LocalBroker();
                    break;
                default:
                    throw new GatewayGeneralError(`Gateway is not support broker ${BrokerFactory.type}`);
            }
            BrokerFactory.logger.info(`Broker ${BrokerFactory.type} is starting...`);
            BrokerFactory.instance.connect();
        }
        return BrokerFactory.instance;
    }
}