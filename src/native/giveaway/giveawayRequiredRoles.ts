import { ArgType, NativeFunction } from "@tryforge/forgescript"
import pullGiveaway from "../../functions/pullGiveaway"
import array from "../../functions/array"

export default new NativeFunction({
    name: "$giveawayRequiredRoles",
    version: "1.0.0",
    description: "Returns the required roles for a giveaway",
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
    output: array<ArgType.Role>(),
    async execute(ctx, [id, sep]) {
        const giveaway = await pullGiveaway(ctx, id)
        return this.success(giveaway?.requirements?.requiredRoles?.join(sep ?? ", "))
    }
})