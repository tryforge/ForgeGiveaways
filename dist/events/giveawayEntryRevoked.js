"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const handlers_1 = require("../handlers");
const __1 = require("..");
const structures_1 = require("../structures");
exports.default = new handlers_1.GiveawaysEventHandler({
    name: "giveawayEntryRevoked",
    version: "1.0.0",
    description: "This event is fired when a giveaway entry is revoked",
    listener: async function (gw) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands.get("giveawayEntryRevoked");
        for (const command of commands) {
            const ctx = new structures_1.Context({
                obj: gw,
                command,
                client: this,
                states: {
                    giveaway: {
                        new: gw
                    }
                },
                data: command.compiled.code,
            });
            forgescript_1.Interpreter.run(ctx);
        }
    },
});
//# sourceMappingURL=giveawayEntryRevoked.js.map