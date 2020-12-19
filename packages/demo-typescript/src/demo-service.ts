
import { Auth, Service, Logger, ILogger, Method, Client, IAccess, Counter, ICounter } from "red-dwarf-sdk";
import { ReverseInput, ReverseOutput } from "./payload";

@Service("dwarf-demo")
@Auth("demo-service-typescript", "<empty>")
export class DemoService {

    @Logger
    private readonly logger!: ILogger;

    @Client("demo-service-typescript", "<empty>")
    private readonly client!: IAccess;

    @Counter("reverse_counter", "total calls for reverse method")
    private readonly reverse_counter!: ICounter;

    @Counter("rreverse_counter", "total calls for rreverse method")
    private readonly rreverse_counter!: ICounter;

    @Method({
        name: "reverse",
        description: "Reverse string",
        examples: [{
            name: "simple1",
            payload: {
                str: "hello"
            }
        }, {
            name: "simple2",
            payload: {
                str: "hello world 123"
            }
        }]
    })
    async reverse(payload: ReverseInput): Promise<ReverseOutput> {
        this.logger.debug("reverse method is called");
        this.reverse_counter.inc();

        return { str: payload.str.split('').reverse().join('') };
    }


    @Method({
        name: "rreverse",
        description: "Double Reverse string",
        examples: [{
            name: "simple1",
            payload: {
                str: "hello"
            }
        }, {
            name: "simple2",
            payload: {
                str: "hello world 123"
            }
        }]
    })
    async rreverse(payload: ReverseInput): Promise<ReverseOutput> {
        this.logger.debug("rreverse method is called");
        this.rreverse_counter.inc();

        const result = await this.client.request("dwarf-demo", "reverse", payload);
        const result2 = await this.client.request("dwarf-demo", "reverse", result);
        return result2;
    }
}
