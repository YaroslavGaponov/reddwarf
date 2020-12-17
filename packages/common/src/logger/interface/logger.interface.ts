import { Level } from "../type";

export interface ILogger {
    info(s: string): void;
    warn(s: string): void;
    error(s: string): void;
    fatal(s: string): void;
    debug(s: string): void;
    trace(s: string): void;
    setLevel(level: Level): void;
}