import Metrics from "prom-client";

export function Counter(name: string, help: string) {
    return (target: any, key: string) => {
        target[key] = new Metrics.Counter({ name, help });
    }
}