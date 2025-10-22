"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: "$deleteGiveaway",
    version: "1.0.0",
    description: "Deletes an existing giveaway from the database permanently, returns bool",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to delete",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
    ],
    output: forgescript_1.ArgType.Boolean,
    async execute(ctx, [id]) {
        const result = await __1.Database.delete(id);
        return this.success(result.affected === 1);
    }
});
//# sourceMappingURL=deleteGiveaway.js.map