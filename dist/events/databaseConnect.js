"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventManager_1 = require("../managers/GiveawaysEventManager");
const __1 = require("..");
exports.default = new GiveawaysEventManager_1.GiveawaysEventHandler({
    name: "databaseConnect",
    description: "This event is fired when the client connected to the giveaway database",
    listener: async function () {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands?.get("databaseConnect");
        if (commands?.length) {
            for (const command of commands) {
                forgescript_1.Interpreter.run({
                    obj: {},
                    command,
                    client: this,
                    data: command.compiled.code,
                });
            }
        }
    },
});
//# sourceMappingURL=databaseConnect.js.map