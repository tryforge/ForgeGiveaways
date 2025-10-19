import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { IGiveawayEvents, GiveawaysCommandManager, GiveawaysManager } from "./managers";
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
}
export declare class ForgeGiveaways extends ForgeExtension {
    readonly options: IForgeGiveawaysOptions;
    name: string;
    description: string;
    version: any;
    requireExtensions: string[];
    emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>;
    giveawaysManager: GiveawaysManager;
    commands: GiveawaysCommandManager;
    constructor(options?: IForgeGiveawaysOptions);
    init(client: ForgeClient): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map