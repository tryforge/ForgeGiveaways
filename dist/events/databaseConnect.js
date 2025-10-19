"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventHandler_1 = require("../handlers/GiveawaysEventHandler");
const __1 = require("..");
const structures_1 = require("../structures");
exports.default = new GiveawaysEventHandler_1.GiveawaysEventHandler({
    name: "databaseConnect",
    version: "1.0.0",
    description: "This event is fired when the database has connected",
    listener: async function () {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands.get("databaseConnect");
        for (const command of commands) {
            const ctx = new structures_1.Context({
                obj: {},
                command,
                client: this,
                data: command.compiled.code,
            });
            forgescript_1.Interpreter.run(ctx);
        }
    },
});
//# sourceMappingURL=databaseConnect.js.map