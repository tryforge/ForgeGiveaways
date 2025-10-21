import { Context } from "@tryforge/forgescript"
import { Database } from "../structures"

export default async function(ctx: Context, id?: string | null) {
    return (id ? await Database.get(id) : ctx.giveaway ?? ctx.extendedStates?.giveaway?.new)
}