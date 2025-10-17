import { ArgType, NativeFunction } from "@tryforge/forgescript"
import getGiveaway from "../functions/getGiveaway"

export default new NativeFunction({
    name: "$giveawayHostID",
    version: "1.0.0",
    description: "Returns the host id of a giveaway",
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
    output: ArgType.User,
    execute(ctx, [id]) {
        const giveaway = getGiveaway(ctx, id) ?? ctx.giveaway
        return this.success(giveaway?.hostID)
    }
})