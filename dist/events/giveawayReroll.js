"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventHandler_1 = require("../handlers/GiveawaysEventHandler");
const __1 = require("..");
const structures_1 = require("../structures");
exports.default = new GiveawaysEventHandler_1.GiveawaysEventHandler({
    name: "giveawayReroll",
    version: "1.0.0",
    description: "This event is fired when a giveaway was rerolled",
    listener: async function (old, newer) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands.get("giveawayReroll");
        for (const command of commands) {
            const ctx = new structures_1.Context({
                obj: newer,
                command,
                client: this,
                states: {
                    giveaway: {
                        new: newer,
                        old
                    }
                },
                data: command.compiled.code,
            });
            forgescript_1.Interpreter.run(ctx);
        }
    },
});
//# sourceMappingURL=giveawayReroll.js.map