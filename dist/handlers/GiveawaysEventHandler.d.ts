import { Interaction, MessageReaction, PartialMessageReaction } from "discord.js";
import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "../structures";
export type EntryContext = Interaction | MessageReaction | PartialMessageReaction;
export interface IGiveawayEvents {
    databaseConnect: [];
    giveawayStart: [Giveaway];
    giveawayEnd: [Giveaway];
    giveawayReroll: [Giveaway, Giveaway];
    giveawayEntryAdd: [Giveaway, Giveaway, EntryContext];
    giveawayEntryRemove: [Giveaway, Giveaway, EntryContext];
    giveawayEntryRevoke: [Giveaway, EntryContext];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventHandler.d.ts.map