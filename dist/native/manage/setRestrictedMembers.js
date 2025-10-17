"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$setRestrictedMembers",
    description: "Sets the restricted members for current giveaway",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "members",
            description: "The members to add as restriction",
            rest: true,
            required: true,
            type: forgescript_1.ArgType.User,
        },
    ],
    execute(ctx, [members]) {
        ctx.requirements.restrictedMembers = members.map((x) => x.id);
        return this.success();
    }
});
//# sourceMappingURL=setRestrictedMembers.js.map