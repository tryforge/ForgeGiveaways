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
    ],
    output: forgescript_1.ArgType.Boolean,
    async execute(ctx, [id]) {
        const client = ctx.client.getExtension(__1.ForgeGiveaways, true);
        const giveaway = await client.giveawaysManager.reroll(id).catch(ctx.noop);
        return this.success(!!giveaway);
    }
});
//# sourceMappingURL=rerollGiveaway.js.map