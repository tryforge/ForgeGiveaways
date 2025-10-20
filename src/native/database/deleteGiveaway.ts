import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Database } from "../.."

export default new NativeFunction({
    name: "$deleteGiveaway",
    version: "1.0.0",
    description: "Deletes an existing giveaway from the database permanently",
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
    output: ArgType.Json,
    async execute(ctx, [id]) {
        const giveaway = await Database.delete(id)
        return this.successJSON(giveaway)
    }
})