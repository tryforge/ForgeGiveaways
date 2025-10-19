import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Database } from "../structures"

export default new NativeFunction({
    name: "$giveawayChannelID",
    version: "1.0.0",
    description: "Returns the channel id of a giveaway",
    unwrap: true,
    brackets: false,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to pull data from",
            rest: false,
            required: true,
            type: ArgType.String,
        },
    ],
    output: ArgType.Channel,
    async execute(ctx, [id]) {
        const giveaway = this.hasFields ? await Database.get(id) : ctx.giveaway
        return this.success(giveaway?.channelID)
    }
})