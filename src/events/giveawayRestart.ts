import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../managers/GiveawaysEventManager"
import { ForgeGiveaways } from ".."

export default new GiveawaysEventHandler({
    name: "giveawayRestart",
    version: "1.0.0",
    description: "This event is fired when a giveaway was restarted",
    listener: async function(gw) {
        const commands = this.getExtension(ForgeGiveaways, true).commands?.get("giveawayRestart")

        if (commands?.length) {
            for (const command of commands) {
                Interpreter.run({
                    obj: gw,
                    command,
                    client: this,
                    data: command.compiled.code,
                })
            }
        }

    },
})