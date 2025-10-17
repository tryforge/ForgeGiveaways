"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventManager_1 = require("../managers/GiveawaysEventManager");
const __1 = require("..");
const structures_1 = require("../structures");
exports.default = new GiveawaysEventManager_1.GiveawaysEventHandler({
    name: "giveawayEntryRemove",
    version: "1.0.0",
    description: "This event is fired when a giveaway entry is removed",
    listener: async function (newer, old) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands?.get("giveawayEntryRemove");
        if (commands?.length) {
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
        }
    },
});
//# sourceMappingURL=giveawayEntryRemove.js.map