"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayProperties = exports.GiveawayProperty = void 0;
const defineProperties_1 = __importDefault(require("../functions/defineProperties"));
var GiveawayProperty;
(function (GiveawayProperty) {
    GiveawayProperty["id"] = "id";
    GiveawayProperty["prize"] = "prize";
    GiveawayProperty["duration"] = "duration";
    GiveawayProperty["timestamp"] = "timestamp";
    GiveawayProperty["winnersCount"] = "winnersCount";
    GiveawayProperty["hasEnded"] = "hasEnded";
    GiveawayProperty["hostID"] = "hostID";
    GiveawayProperty["guildID"] = "guildID";
    GiveawayProperty["channelID"] = "channelID";
    GiveawayProperty["messageID"] = "messageID";
    GiveawayProperty["entries"] = "entries";
    GiveawayProperty["winners"] = "winners";
    GiveawayProperty["previousWinners"] = "previousWinners";
    GiveawayProperty["requiredRoles"] = "requiredRoles";
    GiveawayProperty["restrictedRoles"] = "restrictedRoles";
    GiveawayProperty["restrictedMembers"] = "restrictedMembers";
})(GiveawayProperty || (exports.GiveawayProperty = GiveawayProperty = {}));
exports.GiveawayProperties = (0, defineProperties_1.default)({
    id: (i) => i?.id,
    prize: (i) => i?.prize,
    duration: (i) => i?.duration,
    timestamp: (i) => i?.timestamp,
    winnersCount: (i) => i?.winnersCount,
    hasEnded: (i) => i?.hasEnded,
    hostID: (i) => i?.hostID,
    guildID: (i) => i?.guildID,
    channelID: (i) => i?.channelID,
    messageID: (i) => i?.messageID,
    entries: (i, sep) => i?.entries.join(sep ?? ", "),
    winners: (i, sep) => i?.winners.join(sep ?? ", "),
    previousWinners: (i, sep) => i?.previousWinners?.join(sep ?? ", "),
    requiredRoles: (i, sep) => i?.requirements?.requiredRoles?.join(sep ?? ", "),
    restrictedRoles: (i, sep) => i?.requirements?.restrictedRoles?.join(sep ?? ", "),
    restrictedMembers: (i, sep) => i?.requirements?.restrictedMembers?.join(sep ?? ", "),
});
//# sourceMappingURL=giveaway.js.map