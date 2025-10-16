import { Context as BaseContext, IContextCache } from "@tryforge/forgescript"
import { ExtendedStates, IExtendedRunnable } from "../types"
import { Giveaway } from "./Giveaway"

export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | null
}

export class Context extends BaseContext {
    #cache: Partial<IExtendedContextCache> = {}

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
    }
}