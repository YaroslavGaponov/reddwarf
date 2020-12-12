
import { Auth, Service, Logger, ILogger, Method } from "dwarf-sdk";
import { ReverseInput, ReverseOutput } from "./payload";

@Service("demo")
@Auth("demo-service", "secret")
export class DemoService {

    @Logger
    private readonly logger!: ILogger;

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

}
