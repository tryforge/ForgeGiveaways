import { Context } from "@tryforge/forgescript"
import { ForgeGiveaways } from ".."

export default async function(ctx: Context, id: string) {
    return await ctx.client.getExtension(ForgeGiveaways, true).database.get(id)
}