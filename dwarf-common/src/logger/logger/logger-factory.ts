import { Setting } from "../../decorator";
import { ILogger } from "../interface";
import { Level } from "../type";
import { Logger } from "./logger";

export class LoggerFactory {
    
    @Setting("LOG_LEVEL", Level.INFO | Level.ERROR | Level.FATAL | Level.WARN | Level.TRACE | Level.DEBUG)
    static readonly level: Level;

    static logger: ILogger;

    static create(): ILogger {
        if (!LoggerFactory.logger) {
            LoggerFactory.logger = new Logger(LoggerFactory.level);
        }
        return LoggerFactory.logger;
    }
}