import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "../structures";
import { Interaction } from "discord.js";
export interface IGiveawayEvents {
    databaseConnect: [];
    giveawayStart: [Giveaway];
    giveawayEnd: [Giveaway];
    giveawayEdit: [Giveaway, Giveaway];
    giveawayReroll: [Giveaway, Giveaway];
    giveawayEntryAdd: [Interaction, Giveaway, Giveaway];
    giveawayEntryRemove: [Interaction, Giveaway, Giveaway];
    giveawayEntryRevoked: [Interaction, Giveaway];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventHandler.d.ts.map