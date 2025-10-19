"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventHandler_1 = require("../handlers/GiveawaysEventHandler");
const __1 = require("..");
const structures_1 = require("../structures");
exports.default = new GiveawaysEventHandler_1.GiveawaysEventHandler({
    name: "giveawayEnd",
    version: "1.0.0",
    description: "This event is fired when a giveaway ended",
    listener: async function (gw) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands.get("giveawayEnd");
        for (const command of commands) {
            const ctx = new structures_1.Context({
                obj: gw,
                command,
                client: this,
                states: {
                    giveaway: {
                        new: gw,
                    }
                },
                data: command.compiled.code,
            });
            forgescript_1.Interpreter.run(ctx);
        }
    },
});
//# sourceMappingURL=giveawayEnd.js.map