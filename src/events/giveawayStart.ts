import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../managers/GiveawaysEventManager"
import { GiveawaysErrorType, throwGiveawaysError } from "../functions/error"
import { Context, Database } from "../structures"
import { ForgeGiveaways } from ".."
import { TextChannel } from "discord.js"

export default new GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function(gw) {
        const client = this.getExtension(ForgeGiveaways, true)
        const commands = client.commands.get("giveawayStart")

        if (commands?.length) {
            for (const command of commands) {
                const ctx = new Context({
                    obj: gw,
                    command,
                    client: this,
                    states: {
                        giveaway: {
                            new: gw,
                        }
                    },
                    data: command.compiled.code,
                    allowTopLevelReturn: true
                })

                const result = await Interpreter.run(ctx)

                if (client.options.useDefault === false) {
                    const res = result?.trim()
                    console.log(res)
                    const chan = this.channels.cache.get(gw.channelID) as TextChannel | undefined
                    const msg = res ? await chan?.messages.fetch(res).catch(ctx.noop) : undefined
                    console.log(msg)

                    if (!msg) {
                        throwGiveawaysError(GiveawaysErrorType.MessageNotFound, gw.id)
                        await Database.delete(gw.id)
                        continue
                    }

                    gw.messageID = msg.id
                    await Database.set(gw)
                }
            }
        }
    },
})