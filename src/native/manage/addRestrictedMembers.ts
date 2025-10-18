import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
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
            type: ArgType.User,
        },
    ],
    execute(ctx, [members]) {
        ctx.requirements ??= {}

        const set = new Set(ctx.requirements.restrictedMembers)
        for (const member of members) set.add(member.id)

        ctx.requirements.restrictedMembers = [...set]
        return this.success()
    }
})