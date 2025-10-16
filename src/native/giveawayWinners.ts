import { ArgType, NativeFunction } from "@tryforge/forgescript"
import getGiveaway from "../functions/getGiveaway"
import array from "../functions/array"

export default new NativeFunction({
    name: "$giveawayWinners",
    version: "1.0.0",
    description: "Returns the winners of a giveaway",
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
        {
            name: "separator",
            description: "The separator to use for each value",
            rest: false,
            type: ArgType.String,
        },
    ],
    output: array<ArgType.User>(),
    execute(ctx, [id, sep]) {
        const giveaway = getGiveaway(ctx, id)
        return this.success(giveaway?.winners.join(sep ?? ", "))
    }
})