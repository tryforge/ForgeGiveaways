import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../handlers"
import { Context } from "../structures"
import { ForgeGiveaways } from ".."

export default new GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function(gw) {
        const commands = this.getExtension(ForgeGiveaways, true).commands.get("giveawayStart")

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
                data: command.compiled.code
            })

            const result = await Interpreter.run(ctx)
            console.log(result)
        }
    }
})