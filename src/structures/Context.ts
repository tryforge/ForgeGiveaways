import { Context as BaseContext, IContextCache } from "@tryforge/forgescript"
import { ExtendedStates, IExtendedRunnable } from "../types"
import { BaseInteraction, Interaction, Snowflake } from "discord.js"
import { Giveaway, MongoGiveaway } from "./Giveaway"

export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | MongoGiveaway | null
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
        return (this.#cache.giveaway ??=
            "giveaway" in this.obj
                ? this.obj.giveaway as Giveaway
                : this.obj instanceof Giveaway
                    ? this.obj
                    : null)
    }

    public get interaction() {
        return (this.#cache.interaction ??=
            "baseInteraction" in this.obj
                ? this.obj.baseInteraction as Interaction
                : this.obj instanceof BaseInteraction
                    ? this.obj as Interaction
                    : null)
    }
}

declare module "@tryforge/forgescript" {
    interface Context {
        giveaway: Giveaway | MongoGiveaway | null
        interaction: Interaction | null
        extendedStates?: ExtendedStates
        requirements?: Partial<IGiveawayRequirements>
    }
}