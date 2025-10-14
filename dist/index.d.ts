import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { IGiveawayEvents } from "./managers/GiveawaysEventManager";
import { GiveawaysCommandManager } from "./managers/GiveawaysCommandManager";
import { GiveawaysManager } from "./managers/GiveawaysManager";
export interface IForgeGiveawaysOptions {
    events?: keyof IGiveawayEvents;
    messages?: {
        start?: string;
        end?: string;
        reroll?: string;
    };
}
export declare class ForgeGiveaways extends ForgeExtension {
    readonly options: IForgeGiveawaysOptions;
    name: string;
    description: string;
    version: any;
    readonly giveawaysManager: GiveawaysManager;
    commands: GiveawaysCommandManager | null;
    constructor(options: IForgeGiveawaysOptions);
    init(client: ForgeClient): void;
}
export * from "./managers";
//# sourceMappingURL=index.d.ts.map