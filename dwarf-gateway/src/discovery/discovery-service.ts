import { ILogger, Logger, Notify, ProtocolManager } from "dwarf-common";
import { Broker, Setting } from "../decorator";
import { INetworkServer } from "../interface";
import { IBroker } from "../interface/broker.interface";

export class DiscoveryService implements INetworkServer {

    @Broker
    private readonly broker!: IBroker;

    @Logger
    private logger!: ILogger;

    @Setting("DISCOVERY_INTERVAL", 3000)
    private readonly interval!: number;

    private readonly protocol = new ProtocolManager();
    private timerId!: NodeJS.Timeout;
    private readonly registry: any = {};

    constructor() {
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
    }

    async start(): Promise<void> {
        this.logger.info("Discovery service is starting 👍");
        this.broker.subscribe(`discovery:register`, this.register);
        this.broker.subscribe(`discovery:unregister`, this.unregister);
        this.timerId = setInterval(
            () => {
                const notify = new Notify();
                notify.channel = `discovery:update`;
                notify.payload = this.registry;
                const data = this.protocol.encode(notify);
                this.broker.broadcast(`discovery:update`, data);
            },
            this.interval
        );
    }

    async stop(): Promise<void> {
        this.logger.info("Discovery service is stopping 👎");
        clearInterval(this.timerId);
        this.broker.unsubscribe(`discovery:register`, this.register);
        this.broker.unsubscribe(`discovery:unregister`, this.unregister);
    }


    private register(o: any) {
        const { id, name, info } = o;
        if (this.registry[name]) {
            this.registry[name].access.push(id);
        } else {
            this.registry[name] = {
                info,
                access: [id]
            }
        }
    }

    private unregister(o: any) {
        const { id, name } = o;
        if (this.registry[name]) {
            const idx = this.registry[name].access.indexOf(id);
            if (idx !== -1) {
                this.registry[name].access.splice(idx, 1);
                if (this.registry[name].access.length === 0) {
                    delete this.registry[name];
                }
            }
        }
    }
}