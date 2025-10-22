"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$addRestrictedRoles",
    version: "1.0.0",
    description: "Adds restricted roles to the current giveaway",
    aliases: ["$addRestrictedRole"],
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "roles",
            description: "The roles to add as restriction",
            rest: true,
            required: true,
            type: forgescript_1.ArgType.String,
        },
    ],
    execute(ctx, [roles]) {
        ctx.requirements ??= {};
        const set = new Set(ctx.requirements.restrictedRoles);
        for (const role of roles)
            set.add(role);
        ctx.requirements.restrictedRoles = [...set];
        return this.success();
    }
});
//# sourceMappingURL=addRestrictedRoles.js.map