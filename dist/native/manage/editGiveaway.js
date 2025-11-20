"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: "$editGiveaway",
    version: "1.1.0",
    description: "Edits an existing giveaway on a guild, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to edit",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "guild ID",
            description: "The guild this giveaway is hosted on",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.Guild,
        },
        {
            name: "host ID",
            description: "The new member hosting this giveaway",
            rest: false,
            type: forgescript_1.ArgType.Member,
            pointer: 1,
        },
        {
            name: "prize",
            description: "The new prize for this giveaway",
            rest: false,
            type: forgescript_1.ArgType.String
        },
        {
            name: "winners",
            description: "The new winners count for this giveaway",
            rest: false,
            type: forgescript_1.ArgType.Number
        }
    ],
    output: forgescript_1.ArgType.Boolean,
    async execute(ctx, [id, , host, prize, winners]) {
        const client = ctx.client.getExtension(__1.ForgeGiveaways, true);
        const giveaway = await client.giveawaysManager.edit(id, {
            hostID: host?.id,
            prize: prize || undefined,
            winnersCount: winners || undefined,
            requirements: ctx.requirements
        }).catch(ctx.noop);
        return this.success(!!giveaway);
    }
});
//# sourceMappingURL=editGiveaway.js.map