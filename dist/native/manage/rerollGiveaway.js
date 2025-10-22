"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: "$rerollGiveaway",
    version: "1.0.0",
    description: "Rerolls an existing giveaway on a guild, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to reroll",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "unique",
            description: "Whether to not include the previous winners, defaults to false",
            rest: false,
            type: forgescript_1.ArgType.Boolean,
        },
        {
            name: "amount",
            description: "The amount of new winners, defaults to max winners count",
            rest: false,
            type: forgescript_1.ArgType.Number,
        },
    ],
    output: forgescript_1.ArgType.Boolean,
    async execute(ctx, [id, unique, amount]) {
        const client = ctx.client.getExtension(__1.ForgeGiveaways, true);
        const giveaway = await client.giveawaysManager.reroll(id, unique || undefined, amount || undefined).catch(ctx.noop);
        return this.success(!!giveaway);
    }
});
//# sourceMappingURL=rerollGiveaway.js.map