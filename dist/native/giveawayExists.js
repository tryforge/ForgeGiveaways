"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("../structures");
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayExists",
    description: "Returns whether a giveaway exists",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The id of the giveaway to check for",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
    ],
    output: forgescript_1.ArgType.Boolean,
    async execute(ctx, [id]) {
        return this.success(!!(await structures_1.Database.get(id)));
    }
});
//# sourceMappingURL=giveawayExists.js.map