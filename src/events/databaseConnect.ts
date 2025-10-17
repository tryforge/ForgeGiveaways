import { Interpreter } from "@tryforge/forgescript"
import { GiveawaysEventHandler } from "../managers/GiveawaysEventManager"
import { ForgeGiveaways } from ".."
import { Context } from "../structures"

export default new GiveawaysEventHandler({
    name: "databaseConnect",
    version: "1.0.0",
    description: "This event is fired when the database has connected",
    listener: async function() {
        const commands = this.getExtension(ForgeGiveaways, true).commands?.get("databaseConnect")

        if (commands?.length) {
            for (const command of commands) {
                const ctx = new Context({
                    obj: {},
                    command,
                    client: this,
                    data: command.compiled.code,
                })

                Interpreter.run(ctx)
            }
        }
    },
})