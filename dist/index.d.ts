import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { GiveawaysCommandManager, GiveawaysManager } from "./managers";
import { IGiveawayEvents } from "./handlers";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
export interface IForgeGiveawaysOptions {
    /**
     * The giveaway events to use.
     */
    events?: keyof IGiveawayEvents;
    /**
     * Whether to use the default giveaway messages. Defaults to `true`.
     */
    useDefault?: boolean;
    /**
     * Whether to use reactions for entering the giveaways. Defaults to `false`.
     */
    useReactions?: boolean;
}
export declare class ForgeGiveaways extends ForgeExtension {
    readonly options: IForgeGiveawaysOptions;
    name: string;
    description: string;
    version: string;
    requireExtensions: string[];
    emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>;
    giveawaysManager: GiveawaysManager;
    commands: GiveawaysCommandManager;
    constructor(options?: IForgeGiveawaysOptions);
    init(client: ForgeClient): Promise<void>;
}
export * from "./handlers";
export * from "./managers";
export * from "./structures";
export * from "./types";
//# sourceMappingURL=index.d.ts.map