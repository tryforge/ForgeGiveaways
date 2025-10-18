import { Giveaway } from "../structures";
export declare enum GiveawayProperty {
    id = "id",
    prize = "prize",
    duration = "duration",
    winnersCount = "winnersCount",
    hasEnded = "hasEnded",
    hostID = "hostID",
    guildID = "guildID",
    channelID = "channelID",
    messageID = "messageID",
    entries = "entries",
    winners = "winners",
    requiredRoles = "requiredRoles",
    restrictedRoles = "restrictedRoles",
    restrictedMembers = "restrictedMembers"
}
export declare const GiveawayProperties: import("../functions/defineProperties").Properties<typeof GiveawayProperty, Giveaway>;
//# sourceMappingURL=giveaway.d.ts.map