import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "../structures";
export interface IGiveawayEvents {
    giveawayStart: [Giveaway];
    giveawayEnd: [Giveaway];
    giveawayEdit: [Giveaway, Giveaway];
    giveawayReroll: [Giveaway, Giveaway];
    giveawayEntryAdd: [Giveaway, Giveaway];
    giveawayEntryRemove: [Giveaway, Giveaway];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventManager.d.ts.map