import { Context as BaseContext, IContextCache } from "@tryforge/forgescript";
import { ExtendedStates, IExtendedRunnable } from "../types";
import { Interaction, Snowflake } from "discord.js";
import { Giveaway, MongoGiveaway } from "./Giveaway";
export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | MongoGiveaway | null;
}
export interface IGiveawayRequirements {
    requiredRoles?: Snowflake[];
    restrictedRoles?: Snowflake[];
    restrictedMembers?: Snowflake[];
}
export declare class Context extends BaseContext {
    #private;
    readonly runtime: IExtendedRunnable;
    requirements: Partial<IGiveawayRequirements>;
    constructor(runtime: IExtendedRunnable);
    get obj(): import("../types").ExtendedSendable;
    get extendedStates(): ExtendedStates | undefined;
    get giveaway(): Giveaway | null;
    get interaction(): Interaction | null;
}
declare module "@tryforge/forgescript" {
    interface Context {
        giveaway: Giveaway | MongoGiveaway | null;
        interaction: Interaction | null;
        extendedStates?: ExtendedStates;
        requirements?: Partial<IGiveawayRequirements>;
    }
}
//# sourceMappingURL=Context.d.ts.map