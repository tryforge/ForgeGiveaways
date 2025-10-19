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
            name: "unique",
            description: "Whether to not include the previous winners, defaults to false",
            rest: false,
            type: ArgType.Boolean,
        },
        {
            name: "amount",
            description: "The amount of new winners, defaults to max winners count",
            rest: false,
            type: ArgType.Number,
        },
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id, unique, amount]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)
        const giveaway = await client.giveawaysManager.reroll(id, unique || undefined, amount || undefined).catch(ctx.noop)
        return this.success(!!giveaway)
    }
})