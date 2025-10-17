import { Context as BaseContext, IContextCache } from "@tryforge/forgescript";
import { ExtendedStates, IExtendedRunnable } from "../types";
import { Snowflake } from "discord.js";
import { Giveaway } from "./Giveaway";
export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | null;
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
}
declare module "@tryforge/forgescript" {
    interface Context {
        giveaway?: Giveaway | null;
        extendedStates?: ExtendedStates;
        requirements?: Partial<IGiveawayRequirements>;
    }
}
//# sourceMappingURL=Context.d.ts.map