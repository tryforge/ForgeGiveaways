"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysErrorType = void 0;
exports.throwGiveawaysError = throwGiveawaysError;
const forgescript_1 = require("@tryforge/forgescript");
var GiveawaysErrorType;
(function (GiveawaysErrorType) {
    GiveawaysErrorType["MessageNotFound"] = "Could not find and update the message for giveaway with ID \"$1\"";
    GiveawaysErrorType["MessageNotDetermined"] = "Could not determine the messageID for giveaway with ID \"$1\", giveaway terminated";
    GiveawaysErrorType["UnknownGiveaway"] = "Could not find the giveaway with ID \"$1\"";
    GiveawaysErrorType["NoStartMessage"] = "No start message for giveaways has been configured, giveaway terminated";
    GiveawaysErrorType["MultipleStartEvents"] = "Detected multiple giveawayStart events, only one is allowed per client instance";
})(GiveawaysErrorType || (exports.GiveawaysErrorType = GiveawaysErrorType = {}));
/**
 * Throws a giveaways error in the console.
 * @param type The error type to log.
 * @param id The id of the referenced giveaway.
 */
function throwGiveawaysError(type, id) {
    const key = Object.keys(GiveawaysErrorType).find((x) => GiveawaysErrorType[x] === type);
    const message = type.replace(/\$(\d+)/g, () => id ?? "");
    forgescript_1.Logger.error(`[ForgeGiveaways] ${key}: ${message}`);
}
//# sourceMappingURL=error.js.map