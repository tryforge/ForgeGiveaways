import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../handlers"
import { ForgeGiveaways } from ".."
import { Context } from "../structures"

export default new GiveawaysEventHandler({
    name: "giveawayEntryRevoked",
    version: "1.0.0",
    description: "This event is fired when a giveaway entry is revoked",
    listener: async function(gw) {
        const commands = this.getExtension(ForgeGiveaways, true).commands.get("giveawayEntryRevoked")

        for (const command of commands) {
            const ctx = new Context({
                obj: gw,
                command,
                client: this,
                states: {
                    giveaway: {
                        new: gw
                    }
                },
                data: command.compiled.code,
            })

            Interpreter.run(ctx)
        }
    },
})