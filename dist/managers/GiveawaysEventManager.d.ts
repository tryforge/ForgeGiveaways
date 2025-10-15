import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { Giveaway } from "..";
export interface IGiveawayEvents {
    giveawayStart: [
        {
            data: Giveaway | null;
        }
    ];
    giveawayEnd: [
        {
            data: Giveaway | null;
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