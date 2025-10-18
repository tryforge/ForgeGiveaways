import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { IGiveawayEvents, GiveawaysCommandManager, GiveawaysManager } from "./managers";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
import { Database } from "./structures";
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
    readonly database: Database;
    commands: GiveawaysCommandManager | null;
    constructor(options?: IForgeGiveawaysOptions | undefined);
    init(client: ForgeClient): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map