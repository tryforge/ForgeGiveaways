import { ArgType, NativeFunction } from "@tryforge/forgescript"
import pullGiveaway from "../functions/pullGiveaway"

export default new NativeFunction({
    name: "$giveawayHasEnded",
    version: "1.0.0",
    description: "Returns whether the giveaway has ended",
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
    output: ArgType.Boolean,
    async execute(ctx, [id]) {
        const giveaway = await pullGiveaway(ctx, id)
        return this.success(giveaway?.hasEnded)
    }
})