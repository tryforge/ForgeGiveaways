"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const handlers_1 = require("../handlers");
const structures_1 = require("../structures");
const __1 = require("..");
const error_1 = require("../functions/error");
exports.default = new handlers_1.GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function (gw) {
        const client = this.getExtension(__1.ForgeGiveaways, true);
        const commands = client.commands.get("giveawayStart");
        const command = commands[0];
        if (commands.length > 1)
            throw new Error(error_1.GiveawaysErrorType.MultipleStartEvents);
        if (!command && client.options.useDefault === false) {
            await structures_1.Database.delete(gw.id);
            throw new Error(error_1.GiveawaysErrorType.NoStartMessage);
        }
        if (command) {
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
                allowTopLevelReturn: true
            });
            const result = await forgescript_1.Interpreter.run(ctx);
            if (client.options.useDefault === false) {
                const res = result?.trim();
                const msg = await client.giveawaysManager.fetchMessage(gw.channelID, res);
                if (msg) {
                    gw.messageID = msg.id;
                    await structures_1.Database.set(gw);
                }
                else {
                    (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotDetermined, gw.id);
                    await structures_1.Database.delete(gw.id);
                }
            }
        }
    }
});
//# sourceMappingURL=giveawayStart.js.map