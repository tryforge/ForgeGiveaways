"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const handlers_1 = require("../handlers");
const structures_1 = require("../structures");
const __1 = require("..");
exports.default = new handlers_1.GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function (gw) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands.get("giveawayStart");
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
                data: command.compiled.code
            });
            const result = await forgescript_1.Interpreter.run(ctx);
            console.log(result);
        }
    }
});
//# sourceMappingURL=giveawayStart.js.map