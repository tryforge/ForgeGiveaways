import { Context as BaseContext, IContextCache } from "@tryforge/forgescript";
import { ExtendedStates, IExtendedRunnable } from "../types";
import { Giveaway } from "./Giveaway";
export interface IExtendedContextCache extends IContextCache {
    giveaway: Giveaway | null;
}
export declare class Context extends BaseContext {
    #private;
    readonly runtime: IExtendedRunnable;
    constructor(runtime: IExtendedRunnable);
    get obj(): import("../types").ExtendedSendable;
    get extendedStates(): ExtendedStates | undefined;
    get giveaway(): Giveaway | null;
}
declare module "@tryforge/forgescript" {
    interface Context {
        giveaway?: Giveaway | null;
        extendedStates?: ExtendedStates;
    }
}
//# sourceMappingURL=Context.d.ts.map