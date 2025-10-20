import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Database } from "../.."

export default new NativeFunction({
    name: "$deleteGiveaway",
    version: "1.0.0",
    description: "Deletes an existing giveaway from the database permanently, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to delete",
            rest: false,
            required: true,
            type: ArgType.String,
        },
    ],
    output: ArgType.Boolean,
    async execute(ctx, [id]) {
        const result = await Database.delete(id)
        return this.success(result.affected === 1)
    }
})