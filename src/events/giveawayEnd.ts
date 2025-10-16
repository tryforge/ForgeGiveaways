import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../managers/GiveawaysEventManager"
import { ForgeGiveaways } from ".."
import { Context } from "../structures"

export default new GiveawaysEventHandler({
    name: "giveawayEnd",
    version: "1.0.0",
    description: "This event is fired when a giveaway ended",
    listener: async function(gw) {
        const commands = this.getExtension(ForgeGiveaways, true).commands?.get("giveawayEnd")

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
                })

                Interpreter.run(ctx)
            }
        }
    },
})