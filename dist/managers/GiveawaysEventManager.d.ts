import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { DatabaseType, IGiveawaysEvents } from "discord-giveaways-super";
export type GiveawaysEvents = IGiveawaysEvents<DatabaseType.JSON>;
export declare class GiveawaysEventHandler<T extends keyof GiveawaysEvents> extends BaseEventHandler<GiveawaysEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GiveawaysEventManager.d.ts.map