import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Database } from "../../structures"

export default new NativeFunction({
    name: "$giveawayExists",
    version: "1.0.0",
    description: "Returns whether a giveaway exists",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The id of the giveaway to check for",
            rest: false,
            required: true,
            type: ArgType.String,
        },
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id]) {
        return this.success(!!(await Database.get(id)))
    }
})