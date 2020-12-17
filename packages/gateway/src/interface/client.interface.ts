export interface IClient {
    onMessage(data: Buffer):void;
    send(data: Buffer): void;
    close(): void;
}