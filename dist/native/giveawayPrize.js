"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("../structures");
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayPrize",
    version: "1.0.0",
    description: "Returns the prize of a giveaway",
    unwrap: true,
    brackets: false,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to pull data from",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [id]) {
        const giveaway = await structures_1.Database.get(id) ?? ctx.giveaway;
        return this.success(giveaway?.prize);
    }
});
//# sourceMappingURL=giveawayPrize.js.map