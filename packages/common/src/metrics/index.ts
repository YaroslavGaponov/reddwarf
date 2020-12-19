import Metrics from "prom-client";

export * from "./decorator";
export * from "./interface";


Metrics.collectDefaultMetrics();

export function getMetricsData() {
    return Metrics.register.metrics();
}