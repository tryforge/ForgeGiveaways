import { ArgType, NativeFunction } from "@tryforge/forgescript"
import pullGiveaway from "../functions/pullGiveaway"

export default new NativeFunction({
    name: "$giveawayTimestamp",
    version: "1.0.0",
    description: "Returns the created timestamp of a giveaway in ms",
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
    output: ArgType.Number,
    async execute(ctx, [id]) {
        const giveaway = await pullGiveaway(ctx, id)
        return this.success(giveaway?.timestamp)
    }
})