import { Giveaway } from "../structures/Giveaway";
export declare enum GiveawayProperty {
    id = "id",
    prize = "prize",
    duration = "duration",
    winnersCount = "winnersCount",
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