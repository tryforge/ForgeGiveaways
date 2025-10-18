import { Snowflake } from "discord.js";
export declare enum GiveawaysErrorType {
    MessageNotFound = "Could not determine the messageID for giveaway with ID \"$1\", giveaway terminated"
}
/**
 * Throws a giveaways error in the console.
 * @param type The error type to log.
 * @param id The id of the referenced giveaway.
 */
export declare function throwGiveawaysError(type: GiveawaysErrorType, id: Snowflake): void;
//# sourceMappingURL=error.d.ts.map