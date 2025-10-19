import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Database } from "../structures"
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
    async execute(ctx, [id, sep]) {
        const giveaway = this.hasFields ? await Database.get(id) : ctx.giveaway
        return this.success(giveaway?.winners.join(sep ?? ", "))
    }
})