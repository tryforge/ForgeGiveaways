import { ArgType, NativeFunction } from "@tryforge/forgescript"
import getGiveaway from "../functions/getGiveaway"

export default new NativeFunction({
    name: "$giveawayGuildID",
    version: "1.0.0",
    description: "Returns the guild id of a giveaway",
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
    output: ArgType.Guild,
    execute(ctx, [id]) {
        const giveaway = getGiveaway(ctx, id)
        return this.success(giveaway?.guildID)
    }
})