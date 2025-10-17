import { Context } from "@tryforge/forgescript"
import { ForgeGiveaways } from ".."

export default function(ctx: Context, id: string) {
    return ctx.client.getExtension(ForgeGiveaways, true).giveawaysManager.get(id)
}