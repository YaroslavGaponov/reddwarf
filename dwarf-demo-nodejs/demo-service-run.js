const { Access } = require("dwarf-sdk");
const { name, info, service } = require("./demo-service");

const options = {
    host: process.env.GATEWAY_HOST || "localhost",
    port: process.env.GATEWAY_PORT || 8080,
    applicationId: "demo-service-nodejs",
    secretKey: "<empty>"
};

(async () => {
    const access = new Access(options);
    await access.connect();
    await access.register(name, info, new service(access));
    process.once("SIGINT", () => access.disconnect());
})();