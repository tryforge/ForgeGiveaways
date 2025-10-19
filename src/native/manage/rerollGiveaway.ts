import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ForgeGiveaways } from "../.."

export default new NativeFunction({
    name: "$rerollGiveaway",
    version: "1.0.0",
    description: "Rerolls an existing giveaway on a guild, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to reroll",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "amount",
            description: "The amount of new winners, defaults to winners count",
            rest: false,
            type: ArgType.Number,
        },
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id, amount]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)
        const giveaway = await client.giveawaysManager.reroll(id, amount || undefined).catch(ctx.noop)
        return this.success(!!giveaway)
    }
})