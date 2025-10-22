import { Logger } from "@tryforge/forgescript"
import { Snowflake } from "discord.js"

export enum GiveawaysErrorType {
    MessageNotFound = `Could not find and update the message for giveaway with ID "$1"`,
    MessageNotDetermined = `Could not determine the messageID for giveaway with ID "$1", giveaway terminated`,
    UnknownGiveaway = `Could not find the giveaway with ID "$1"`,
    NoStartEvent = `The giveawayStart event must be defined to start giveaways, but none was detected`,
    MultipleStartEvents = `Detected multiple giveawayStart events, only one is allowed per client instance`,
    GiveawayNotActive = `Giveaway with ID "$1" has already ended and can no longer be entered`,
}

/**
 * Throws a giveaways error in the console.
 * @param type The error type to log.
 * @param id The id of the referenced giveaway.
 */
export function throwGiveawaysError(type: GiveawaysErrorType, id?: Snowflake) {
    const key = Object.keys(GiveawaysErrorType).find((x) => GiveawaysErrorType[x as keyof typeof GiveawaysErrorType] === type)
    const message = type.replace(/\$(\d+)/g, () => id ?? "")
    Logger.error(`[ForgeGiveaways] ${key}: ${message}`)
}