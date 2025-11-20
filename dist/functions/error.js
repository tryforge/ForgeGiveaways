"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysErrorType = void 0;
exports.throwGiveawaysError = throwGiveawaysError;
const forgescript_1 = require("@tryforge/forgescript");
var GiveawaysErrorType;
(function (GiveawaysErrorType) {
    GiveawaysErrorType["MessageNotFound"] = "Could not find and update the message for giveaway with ID \"$1\"";
    GiveawaysErrorType["MessageNotDetermined"] = "Could not determine the messageID for giveaway with ID \"$1\", giveaway terminated";
    GiveawaysErrorType["UnknownGiveaway"] = "Could not find the giveaway associated with message ID \"$1\"";
    GiveawaysErrorType["MissingStartEvent"] = "The giveawayStart event must be defined to start giveaways, but none was detected";
    GiveawaysErrorType["MultipleStartEvents"] = "Detected multiple giveawayStart events, only one is allowed per client instance";
    GiveawaysErrorType["GiveawayNotActive"] = "Giveaway with ID \"$1\" has already ended and can no longer be entered";
})(GiveawaysErrorType || (exports.GiveawaysErrorType = GiveawaysErrorType = {}));
/**
 * Throws a giveaways error in the console.
 * @param type The type of error to log.
 * @param value The value to provide in the error message.
 * @returns
 */
function throwGiveawaysError(type, value) {
    const key = Object.keys(GiveawaysErrorType).find((x) => GiveawaysErrorType[x] === type);
    const message = type.replace(/\$(\d+)/g, () => value ?? "");
    forgescript_1.Logger.error(`[ForgeGiveaways] ${key}: ${message}`);
}
//# sourceMappingURL=error.js.map