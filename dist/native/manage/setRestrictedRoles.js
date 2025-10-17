"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$setRestrictedRoles",
    description: "Sets the restricted roles for current giveaway",
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
        ctx.requirements.restrictedRoles = roles;
        return this.success();
    }
});
//# sourceMappingURL=setRestrictedRoles.js.map