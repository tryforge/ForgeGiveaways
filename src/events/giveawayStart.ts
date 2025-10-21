import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../handlers"
import { Context, Database } from "../structures"
import { ForgeGiveaways } from ".."
import { GiveawaysErrorType, throwGiveawaysError } from "../functions/error"

export default new GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function (gw) {
        const client = this.getExtension(ForgeGiveaways, true)
        const commands = client.commands.get("giveawayStart")
        const command = commands[0]

        if (commands.length > 1) throw new Error(GiveawaysErrorType.MultipleStartEvents)
        if (!command && !client.options.useDefault) {
            await Database.delete(gw.id)
            throw new Error(GiveawaysErrorType.NoStartMessage)
        }

        if (commands) {
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

            if (!client.options.useDefault) {
                const res = result?.trim()
                const msg = await client.giveawaysManager.fetchMessage(gw.channelID, res)

                if (msg) {
                    gw.messageID = msg.id
                    await Database.set(gw)
                } else {
                    throwGiveawaysError(GiveawaysErrorType.MessageNotDetermined, gw.id)
                    await Database.delete(gw.id)
                }
            }
        }
    }
})