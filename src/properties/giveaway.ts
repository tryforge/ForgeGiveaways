import defineProperties from "../functions/defineProperties"
import { Giveaway } from "../structures"

export enum GiveawayProperty {
    id = "id",
    prize = "prize",
    duration = "duration",
    timestamp = "timestamp",
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
    restrictedMembers = "restrictedMembers",
}

export const GiveawayProperties = defineProperties<typeof GiveawayProperty, Giveaway>({
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
    requiredRoles: (i, sep) => i?.requirements?.requiredRoles?.join(sep ?? ", "),
    restrictedRoles: (i, sep) => i?.requirements?.restrictedRoles?.join(sep ?? ", "),
    restrictedMembers: (i, sep) => i?.requirements?.restrictedMembers?.join(sep ?? ", "),
})