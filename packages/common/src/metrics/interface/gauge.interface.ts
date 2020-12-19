export interface IGauge {
    inc(n?: number): void;
    dec(n?: number): void;
}