import { Setting } from "red-dwarf-common";
import { INetworkServer } from "../interface";
import { WSServer } from "./ws-server";

export class WSServerFactory {

    @Setting("PORT", 38080)
    private static readonly port: number;

    private static instance: INetworkServer;

    static create(): INetworkServer {
        if (!WSServerFactory.instance) {
            WSServerFactory.instance = new WSServer(WSServerFactory.port);
        }
        return WSServerFactory.instance
    }
}