"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayID",
    version: "1.0.0",
    description: "Returns the id of the current giveaway",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    execute(ctx) {
        return this.success(ctx.giveaway?.id);
    }
});
//# sourceMappingURL=giveawayID.js.map