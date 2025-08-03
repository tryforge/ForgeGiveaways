import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../managers/GiveawaysEventManager"
import { ForgeGiveaways } from ".."

export default new GiveawaysEventHandler({
    name: "databaseConnect",
    version: "1.0.0",
    description: "This event is fired when the client connected to the giveaway database",
    listener: async function() {
        const commands = this.getExtension(ForgeGiveaways, true).commands?.get("databaseConnect")

        if (commands?.length) {
            for (const command of commands) {
                Interpreter.run({
                    obj: {},
                    command,
                    client: this,
                    data: command.compiled.code,
                })
            }
        }

    },
})