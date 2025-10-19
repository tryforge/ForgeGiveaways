"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GiveawaysEventManager_1 = require("../managers/GiveawaysEventManager");
const error_1 = require("../functions/error");
const structures_1 = require("../structures");
const __1 = require("..");
exports.default = new GiveawaysEventManager_1.GiveawaysEventHandler({
    name: "giveawayStart",
    version: "1.0.0",
    description: "This event is fired when a giveaway started",
    listener: async function (gw) {
        const client = this.getExtension(__1.ForgeGiveaways, true);
        const commands = client.commands.get("giveawayStart");
        if (commands?.length) {
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
                    allowTopLevelReturn: true
                });
                const result = await forgescript_1.Interpreter.run(ctx.runtime);
                if (client.options.useDefault === false) {
                    const res = result?.trim();
                    console.log(res);
                    const chan = this.channels.cache.get(gw.channelID);
                    const msg = res ? await chan?.messages.fetch(res).catch(ctx.noop) : undefined;
                    console.log(msg);
                    if (!msg) {
                        (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotFound, gw.id);
                        await structures_1.Database.delete(gw.id);
                        continue;
                    }
                    gw.messageID = msg.id;
                    await structures_1.Database.set(gw);
                }
            }
        }
    },
});
//# sourceMappingURL=giveawayStart.js.map