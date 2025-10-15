import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../structures"

export default new NativeFunction({
    name: "$giveawayID",
    version: "1.0.0",
    description: "Returns the id of the current giveaway",
    unwrap: false,
    output: ArgType.String,
    execute(ctx: Context) {
        return this.success(ctx.giveaway?.id)
    }
})