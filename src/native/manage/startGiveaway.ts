import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { BaseChannel, GuildBasedChannel } from "discord.js"
import { ForgeGiveaways } from "../.."

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
            type: ArgType.Time
        },
        {
            name: "winners",
            description: "How many winners this giveaway will have",
            rest: false,
            type: ArgType.Number
        }
    ],
    output: ArgType.String,
    async execute(ctx, [channel, host, prize, duration, winners]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)

        const giveaway = await client.giveawaysManager.start({
            guildID: (channel as GuildBasedChannel).guildId,
            channelID: channel.id,
            hostID: host.id,
            duration,
            prize,
            winnersCount: winners || 1,
            requirements: ctx.requirements
        }).catch(ctx.noop)

        return this.success(giveaway?.id)
    }
})