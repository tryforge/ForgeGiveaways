import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { IGiveawayEvents } from "./managers/GiveawaysEventManager";
import { GiveawaysCommandManager } from "./managers/GiveawaysCommandManager";
import { GiveawaysManager } from "./managers/GiveawaysManager";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
export interface IForgeGiveawaysOptions {
    events?: keyof IGiveawayEvents;
    messages?: {
        start: string;
        end: string;
        reroll: string;
    };
}
export declare class ForgeGiveaways extends ForgeExtension {
    readonly options?: IForgeGiveawaysOptions | undefined;
    name: string;
    description: string;
    version: any;
    emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>;
    readonly giveawaysManager: GiveawaysManager;
    commands: GiveawaysCommandManager | null;
    constructor(options?: IForgeGiveawaysOptions | undefined);
    init(client: ForgeClient): void;
}
export * from "./managers";
//# sourceMappingURL=index.d.ts.map