export declare enum GiveawaysErrorType {
    MessageNotFound = "Could not find and update the message for giveaway with ID \"$1\"",
    MessageNotDetermined = "Could not determine the messageID for giveaway with ID \"$1\", giveaway terminated",
    UnknownGiveaway = "Could not find the giveaway associated with message ID \"$1\"",
    MissingStartEvent = "The giveawayStart event must be defined to start giveaways, but none was detected",
    MultipleStartEvents = "Detected multiple giveawayStart events, only one is allowed per client instance",
    GiveawayNotActive = "Giveaway with ID \"$1\" has already ended and can no longer be entered"
}
/**
 * Throws a giveaways error in the console.
 * @param type The type of error to log.
 * @param value The value to provide in the error message.
 * @returns
 */
export declare function throwGiveawaysError(type: GiveawaysErrorType, value?: string): void;
//# sourceMappingURL=error.d.ts.map