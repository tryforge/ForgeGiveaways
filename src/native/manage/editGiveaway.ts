import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ForgeGiveaways } from "../.."

export default new NativeFunction({
    name: "$editGiveaway",
    version: "1.1.0",
    description: "Edits an existing giveaway on a guild, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to edit",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "guild ID",
            description: "The guild this giveaway is hosted on",
            rest: false,
            required: true,
            type: ArgType.Guild,
        },
        {
            name: "host ID",
            description: "The new member hosting this giveaway",
            rest: false,
            type: ArgType.Member,
            pointer: 1,
        },
        {
            name: "prize",
            description: "The new prize for this giveaway",
            rest: false,
            type: ArgType.String
        },
        {
            name: "winners",
            description: "The new winners count for this giveaway",
            rest: false,
            type: ArgType.Number
        }
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id, , host, prize, winners]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)

        const giveaway = await client.giveawaysManager.edit(id, {
            hostID: host?.id,
            prize: prize || undefined,
            winnersCount: winners || undefined,
            requirements: ctx.requirements
        }).catch(ctx.noop)

        return this.success(!!giveaway)
    }
})