import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../managers/GiveawaysEventManager"
import { ForgeGiveaways } from ".."
import { Context } from "../structures"

export default new GiveawaysEventHandler({
    name: "giveawayEdit",
    version: "1.0.0",
    description: "This event is fired when a giveaway was edited",
    listener: async function(old, newer) {
        const commands = this.getExtension(ForgeGiveaways, true).commands?.get("giveawayEdit")

        if (commands?.length) {
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
        }
    },
})