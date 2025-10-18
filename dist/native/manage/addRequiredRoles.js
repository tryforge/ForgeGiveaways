"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$addRequiredRoles",
    version: "1.0.0",
    description: "Adds required roles to the current giveaway",
    aliases: ["$addRequiredRole"],
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "roles",
            description: "The roles to add as requirement",
            rest: true,
            required: true,
            type: forgescript_1.ArgType.String,
        },
    ],
    execute(ctx, [roles]) {
        ctx.requirements ??= {};
        const set = new Set(ctx.requirements.requiredRoles);
        for (const role of roles)
            set.add(role);
        ctx.requirements.requiredRoles = [...set];
        return this.success();
    }
});
//# sourceMappingURL=addRequiredRoles.js.map