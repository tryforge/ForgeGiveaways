import { ArgType, NativeFunction } from "@tryforge/forgescript"
import getGiveaway from "../functions/getGiveaway"
import array from "../functions/array"

export default new NativeFunction({
    name: "$giveawayRestrictedMembers",
    version: "1.0.0",
    description: "Returns the restricted members for a giveaway",
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
    output: array<ArgType.Member>(),
    async execute(ctx, [id, sep]) {
        const giveaway = await getGiveaway(ctx, id) ?? ctx.giveaway
        return this.success(giveaway?.requirements?.restrictedMembers?.join(sep ?? ", "))
    }
})