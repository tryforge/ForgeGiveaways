import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { GiveawaysEvents } from "./managers/GiveawaysEventManager";
import { GiveawaysCommandManager } from "./managers/GiveawaysCommandManager";
import { DatabaseType, Giveaways } from "discord-giveaways-super";
export interface IGiveawayOptions {
    path: `${string}.json`;
    events?: keyof GiveawaysEvents;
}
export declare class ForgeGiveaways extends ForgeExtension {
    #private;
    readonly options: IGiveawayOptions;
    name: string;
    description: string;
    version: any;
    commands: GiveawaysCommandManager | null;
    giveawayManager: Giveaways<DatabaseType.JSON, `${string}.json`> | null;
    constructor(options: IGiveawayOptions);
    init(client: ForgeClient): void;
}
//# sourceMappingURL=index.d.ts.map