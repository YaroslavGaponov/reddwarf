
module.exports.name = "dwarf-demo";

module.exports.info = [
    {
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
    },
    {
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
    }
]

module.exports.service = class DemoService {

    constructor(access) {
        this.access = access;
    }

    async reverse(payload) {
        return { str: payload.str.split('').reverse().join('') };
    }

    async rreverse(payload) {
        const result = await this.access.request("dwarf-demo", "reverse", payload);
        const result2 = await this.access.request("dwarf-demo", "reverse", result);
        return result2;
    }
}

