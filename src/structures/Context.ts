import { Context as BaseContext, IContextCache } from "@tryforge/forgescript"
import { ExtendedStates, IExtendedRunnable } from "../types"
import { Snowflake } from "discord.js"
import { Giveaway } from "./Giveaway"

export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | null
}

export interface IGiveawayRequirements {
    requiredRoles?: Snowflake[]
    restrictedRoles?: Snowflake[]
    restrictedMembers?: Snowflake[]
}

export class Context extends BaseContext {
    #cache: Partial<IExtendedContextCache> = {}

    requirements: Partial<IGiveawayRequirements> = {}

    public constructor(public readonly runtime: IExtendedRunnable) {
        super(runtime)
    }

    public get obj() {
        return this.runtime.obj
    }

    public get extendedStates() {
        return this.runtime.states
    }

    public get giveaway() {
        return this.#cache.giveaway ??= this.obj instanceof Giveaway ? this.obj : null
    }
}

declare module "@tryforge/forgescript" {
    interface Context {
        giveaway?: Giveaway | null
        extendedStates?: ExtendedStates
        requirements: Partial<IGiveawayRequirements>
    }
}