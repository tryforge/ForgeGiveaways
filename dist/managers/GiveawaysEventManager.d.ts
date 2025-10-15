import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "../structures";
export interface IGiveawayEvents {
    giveawayStart: [
        {
            newData: Giveaway | null;
        }
    ];
    giveawayEnd: [
        {
            newData: Giveaway | null;
        }
    ];
    giveawayEdit: [
        {
            newData: Giveaway | null;
            oldData: Giveaway | null;
        }
    ];
    giveawayReroll: [
        {
            newData: Giveaway | null;
            oldData: Giveaway | null;
        }
    ];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventManager.d.ts.map