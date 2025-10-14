import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { IGiveaway } from "./GiveawaysManager";
export interface IGiveawayEvents {
    giveawayStart: [
        {
            data: IGiveaway | null;
        }
    ];
    giveawayEnd: [
        {
            data: IGiveaway | null;
        }
    ];
    giveawayEdit: [
        {
            newData: IGiveaway | null;
            oldData: IGiveaway | null;
        }
    ];
    giveawayReroll: [
        {
            newData: IGiveaway | null;
            oldData: IGiveaway | null;
        }
    ];
}
export declare class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventManager.d.ts.map