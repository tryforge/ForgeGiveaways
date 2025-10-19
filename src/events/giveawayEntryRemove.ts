import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../handlers/GiveawaysEventHandler"
import { ForgeGiveaways } from ".."
import { Context } from "../structures"

export default new GiveawaysEventHandler({
    name: "giveawayEntryRemove",
    version: "1.0.0",
    description: "This event is fired when a giveaway entry is removed",
    listener: async function(old, newer) {
        const commands = this.getExtension(ForgeGiveaways, true).commands.get("giveawayEntryRemove")

        for (const command of commands) {
            const ctx = new Context({
                obj: newer,
                command,
                client: this,
                states: {
                    giveaway: {
                        new: newer,
                        old
                    }
                },
                data: command.compiled.code,
            })

            Interpreter.run(ctx)
        }
    },
})