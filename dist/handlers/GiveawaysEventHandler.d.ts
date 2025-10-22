import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "../structures";
import { Interaction } from "discord.js";
export interface IGiveawayEvents {
    databaseConnect: [];
    giveawayStart: [Giveaway];
    giveawayEnd: [Giveaway];
    giveawayReroll: [Giveaway, Giveaway];
    giveawayEntryAdd: [Giveaway, Giveaway, Interaction];
    giveawayEntryRemove: [Giveaway, Giveaway, Interaction];
    giveawayEntryRevoke: [Giveaway, Interaction];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventHandler.d.ts.map