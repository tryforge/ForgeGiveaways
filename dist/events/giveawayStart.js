"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventManager_1 = require("../managers/GiveawaysEventManager");
const __1 = require("..");
exports.default = new GiveawaysEventManager_1.GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function (gw) {
        const commands = this.getExtension(__1.ForgeGiveaways, true).commands?.get("giveawayStart");
        if (commands?.length) {
            for (const command of commands) {
                forgescript_1.Interpreter.run({
                    obj: gw,
                    command,
                    client: this,
                    data: command.compiled.code,
                    extras: gw
                });
            }
        }
    },
});
//# sourceMappingURL=giveawayStart.js.map