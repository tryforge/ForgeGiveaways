import { Interaction, MessageReaction, PartialMessageReaction, User } from "discord.js";
import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "../structures";
export type EntryContext = Interaction | MessageReaction | PartialMessageReaction;
export interface IGiveawayEvents {
    databaseConnect: [];
    giveawayStart: [Giveaway];
    giveawayEnd: [Giveaway];
    giveawayReroll: [Giveaway, Giveaway];
    giveawayEntryAdd: [Giveaway, Giveaway, EntryContext, User];
    giveawayEntryRemove: [Giveaway, Giveaway, EntryContext, User];
    giveawayEntryRevoke: [Giveaway, EntryContext, User];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventHandler.d.ts.map