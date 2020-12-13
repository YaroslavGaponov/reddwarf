import { ILogger } from "../interface";
import { Level } from "../type";

export class Logger implements ILogger {

    constructor(private level: Level) { }

    private log(level: Level, s: string): void {
        if (this.level & level) {
            process.stdout.write(`${new Date().toISOString()} ${Level[level]}:\t${s}\n`);
        }
    }

    setLevel(level: Level): void {
        this.level = level;
    }

    info(s: string): void {
        this.log(Level.INFO, s);
    }

    warn(s: string): void {
        this.log(Level.WARN, s);
    }

    error(s: string): void {
        this.log(Level.ERROR, s);
    }

    fatal(s: string): void {
        this.log(Level.FATAL, s);
    }

    debug(s: string): void {
        this.log(Level.DEBUG, s);
    }

    trace(s: string): void {
        this.log(Level.TRACE, s);
    }

}