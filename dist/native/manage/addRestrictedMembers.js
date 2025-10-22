"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$addRestrictedMembers",
    version: "1.0.0",
    description: "Adds restricted members to the current giveaway",
    aliases: ["$addRestrictedMember"],
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
        ctx.requirements ??= {};
        const set = new Set(ctx.requirements.restrictedMembers);
        for (const member of members)
            set.add(member.id);
        ctx.requirements.restrictedMembers = [...set];
        return this.success();
    }
});
//# sourceMappingURL=addRestrictedMembers.js.map