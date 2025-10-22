import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../handlers"
import { ForgeGiveaways } from ".."
import { Context } from "../structures"

export default new GiveawaysEventHandler({
    name: "giveawayEntryAdd",
    version: "1.0.0",
    description: "This event is fired when a giveaway entry is added",
    listener: async function(old, newer, int) {
        const commands = this.getExtension(ForgeGiveaways, true).commands.get("giveawayEntryAdd")

        for (const command of commands) {
            const ctx = new Context({
                obj: int,
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