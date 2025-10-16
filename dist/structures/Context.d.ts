import { Context as BaseContext, IContextCache } from "@tryforge/forgescript";
import { Giveaway } from "./Giveaway";
export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | null;
}
export declare class Context extends BaseContext {
    #private;
    get giveaway(): Giveaway | null;
}
declare module "@tryforge/forgescript" {
    interface Context {
        giveaway?: Giveaway | null;
    }
}
//# sourceMappingURL=Context.d.ts.map