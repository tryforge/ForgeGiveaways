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
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)
        const giveaway = await client.giveawaysManager.reroll(ctx, id)
        return this.success(!!giveaway)
    }
})