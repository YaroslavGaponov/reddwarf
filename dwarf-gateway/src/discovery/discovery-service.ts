import { ILogger, Logger, Notify, ProtocolManager, Setting } from "dwarf-common";
import { Broker } from "../decorator";
import { INetworkServer, IBroker, IRegistry, ChannelType } from "../interface";

const DISCOVERY_REGISTER = "discovery:register";
const DISCOVERY_UNREGISTER = "discovery:unregister";
const DISCOVERY_UPDATE = "discovery:update";

export class DiscoveryService implements INetworkServer {

    @Broker
    private readonly broker!: IBroker;

    @Logger
    private logger!: ILogger;

    @Setting("DISCOVERY_INTERVAL", 5000)
    private readonly interval!: number;

    private readonly protocol = new ProtocolManager();
    private timerId!: NodeJS.Timeout;
    private readonly registry: IRegistry = {};

    constructor() {
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
        this.notify = this.notify.bind(this);
        this.setAnAlarm = this.setAnAlarm.bind(this);
    }

    async start(): Promise<void> {
        this.logger.info("Discovery service is starting 👍");
        this.broker.subscribe(ChannelType.topic, DISCOVERY_REGISTER, this.register);
        this.broker.subscribe(ChannelType.topic, DISCOVERY_UNREGISTER, this.unregister);
        this.broker.subscribe(ChannelType.topic, DISCOVERY_UPDATE, this.setAnAlarm);
        this.setAnAlarm();
    }

    async stop(): Promise<void> {
        this.logger.info("Discovery service is stopping 👎");
        clearInterval(this.timerId);
        this.broker.unsubscribe(ChannelType.topic, DISCOVERY_REGISTER, this.register);
        this.broker.unsubscribe(ChannelType.topic, DISCOVERY_UNREGISTER, this.unregister);
        this.broker.unsubscribe(ChannelType.topic, DISCOVERY_UPDATE, this.setAnAlarm);
    }

    private setAnAlarm() {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(this.notify, this.interval);
    }

    private notify() {
        const notify = new Notify();
        notify.channel = DISCOVERY_UPDATE;
        notify.payload = this.registry;
        const packet = this.protocol.encode(notify);
        this.broker.send(ChannelType.topic, DISCOVERY_UPDATE, packet);
    }

    private register(o: any) {
        const { id, applicationId, name, host, info } = o;
        if (this.registry[name]) {
            this.registry[name].access[id] = { applicationId, host };
        } else {
            this.registry[name] = {
                info,
                access: {
                    [id]: { applicationId, host }
                }
            }
        }
    }

    private unregister(o: any) {
        const { id, name } = o;
        if (this.registry[name]) {
            delete this.registry[name].access[id];
            if (Object.keys(this.registry[name].access).length === 0) {
                delete this.registry[name];
            }

        }
    }
}