import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ForgeGiveaways } from ".."
import { BaseChannel, GuildBasedChannel } from "discord.js"

export default new NativeFunction({
    name: "$startGiveaway",
    version: "1.0.0",
    description: "Starts a new giveaway on a guild, returns giveaway id",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "channel ID",
            description: "The channel this giveaway will be created on",
            rest: false,
            required: true,
            type: ArgType.Channel,
            check: (i: BaseChannel) => i.isTextBased() && !i.isDMBased(),
        },
        {
            name: "host ID",
            description: "The member hosting this giveaway",
            rest: false,
            required: true,
            type: ArgType.Member,
            pointer: 0,
            pointerProperty: "guild"
        },
        {
            name: "prize",
            description: "The prize for this giveaway",
            rest: false,
            required: true,
            type: ArgType.String
        },
        {
            name: "duration",
            description: "The duration for this giveaway.",
            rest: false,
            required: true,
            type: ArgType.String
        },
        {
            name: "winners",
            description: "How many winners this giveaway will have",
            rest: false,
            required: false,
            type: ArgType.Number
        }
    ],
    output: ArgType.Number,
    async execute(ctx, [channel, host, prize, time, winners]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)

        const giveaway = await client.giveawayManager?.start({
            guildID: (channel as GuildBasedChannel).guildId,
            channelID: channel.id,
            hostMemberID: host.id,
            time,
            prize,
            winnersCount: winners || 1,
            defineEmbedStrings(giveaway, host) {
                return {}
            }
        })

        return this.success(giveaway?.id)
    }
})