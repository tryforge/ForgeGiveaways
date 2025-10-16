import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ForgeGiveaways } from "../.."

export default new NativeFunction({
    name: "$endGiveaway",
    version: "1.0.0",
    description: "Ends an existing giveaway on a guild, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to end",
            rest: false,
            required: true,
            type: ArgType.String,
        },
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id]) {
        const client = ctx.client.getExtension(ForgeGiveaways, true)
        const giveaway = await client.giveawaysManager.end(ctx, id)
        return this.success(!!giveaway)
    }
})