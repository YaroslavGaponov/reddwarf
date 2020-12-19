import Metrics from "prom-client";

export function Gauge(name: string, help: string) {
    return (target: any, key: string) => {
        target[key] = new Metrics.Gauge({ name, help });
    }
}