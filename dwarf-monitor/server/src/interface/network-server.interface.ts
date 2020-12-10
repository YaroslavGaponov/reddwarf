export interface INetworkServer {
    start(): Promise<void>;
    stop(): Promise<void>;
}