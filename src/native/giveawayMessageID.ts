import { ArgType, NativeFunction } from "@tryforge/forgescript"
import getGiveaway from "../functions/getGiveaway"

export default new NativeFunction({
    name: "$giveawayMessageID",
    version: "1.0.0",
    description: "Returns the message id of a giveaway",
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
    output: ArgType.Message,
    execute(ctx, [id]) {
        const giveaway = getGiveaway(ctx, id)
        return this.success(giveaway?.messageID)
    }
})