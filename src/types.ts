import { Sendable, IStates, IRunnable } from "@tryforge/forgescript"
import { Giveaway } from "./structures"

export type ExtendedSendable = Sendable | Giveaway

export interface IExtendedStates extends IStates {
    giveaway: Giveaway
}

export type ExtendedStates = {
    [K in keyof IExtendedStates]?: {
        old?: IExtendedStates[K] | null
        new?: IExtendedStates[K] | null
    }
}

export interface IExtendedRunnable extends IRunnable {
    obj: ExtendedSendable
    states?: ExtendedStates
}