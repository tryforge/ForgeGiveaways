"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const handlers_1 = require("../handlers");
const __1 = require("..");
const structures_1 = require("../structures");
exports.default = new handlers_1.GiveawaysEventHandler({
    name: "giveawayEntryRemove",
    version: "1.0.0",
    description: "This event is fired when a giveaway entry is removed",
    listener: async function (old, newer, obj, user) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands.get("giveawayEntryRemove");
        for (const command of commands) {
            const ctx = new structures_1.Context({
                obj,
                command,
                client: this,
                states: {
                    giveaway: {
                        new: newer,
                        old
                    },
                    user: {
                        new: user
                    }
                },
                data: command.compiled.code,
            });
            forgescript_1.Interpreter.run(ctx);
        }
    },
});
//# sourceMappingURL=giveawayEntryRemove.js.map