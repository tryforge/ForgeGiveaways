import { Context as BaseContext, IContextCache } from "@tryforge/forgescript"
import { Giveaway } from "./Giveaway"

export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | null
}

export class Context extends BaseContext {
    #cache: Partial<IExtendedContextCache> = {}

    public get giveaway() {
        return this.#cache.giveaway ??= this.obj instanceof Giveaway ? this.obj : null
    }
}

declare module "@tryforge/forgescript" {
    interface Context {
        giveaway?: Giveaway | null
    }
}