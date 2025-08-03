"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
exports.default = new forgescript_1.NativeFunction({
    name: "$startGiveaway",
    version: "1.0.0",
    description: "Starts a new giveaway on a guild, returns giveaway id",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "channel ID",
            description: "The channel this giveaway will be created on",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.Channel,
            check: (i) => i.isTextBased() && !i.isDMBased(),
        },
        {
            name: "host ID",
            description: "The member hosting this giveaway",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.Member,
            pointer: 0,
            pointerProperty: "guild"
        },
        {
            name: "duration",
            description: "The duration for this giveaway.",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String
        },
        {
            name: "prize",
            description: "The prize for this giveaway",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String
        },
        {
            name: "winners",
            description: "How many winners this giveaway will have",
            rest: false,
            required: false,
            type: forgescript_1.ArgType.Number
        }
    ],
    output: forgescript_1.ArgType.Number,
    async execute(ctx, [channel, host, time, prize, winners]) {
        const client = ctx.client.getExtension(__1.ForgeGiveaways, true);
        const giveaway = await client.giveawayManager?.start({
            guildID: channel.guildId,
            channelID: channel.id,
            hostMemberID: host.id,
            time,
            prize,
            winnersCount: winners || 1,
        });
        return this.success(giveaway?.id);
    }
});
//# sourceMappingURL=startGiveaway.js.map