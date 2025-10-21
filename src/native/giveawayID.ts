import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
    name: "$giveawayID",
    version: "1.0.0",
    description: "Returns the id of the current giveaway",
    unwrap: false,
    output: ArgType.String,
    execute(ctx) {
        const giveaway = ctx.giveaway ?? ctx.extendedStates?.giveaway?.new
        return this.success(giveaway?.id)
    }
})