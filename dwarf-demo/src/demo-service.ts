
import { Auth, Service, Logger, ILogger, Method, Client, IAccess } from "dwarf-sdk";
import { ReverseInput, ReverseOutput } from "./payload";

@Service("demo")
@Auth("demo-service", "secret")
export class DemoService {

    @Logger
    private readonly logger!: ILogger;

    @Client("demo-client", "secret")
    private readonly client!: IAccess;

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
        await this.client.connect();
        const result = await this.client.request("demo", "reverse", payload);
        return this.client.request("demo", "reverse", result);
    }
}
