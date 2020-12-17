export function Setting<T>(name: string, value: T) {
    return (target: any, propertyKey: string) => {
        if (name in process.env) {
            switch (typeof value) {
                case "boolean":
                    target[propertyKey] = process.env[name] === "true";
                    break;
                case "number":
                    target[propertyKey] = parseInt(process.env[name] || "", 10);
                    break;
                case "string":
                default:
                    target[propertyKey] = process.env[name];
                    break;
            }
        } else {
            target[propertyKey] = value;
        }
    }
}
