import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
    name: "$setRestrictedMembers",
    version: "1.0.0",
    description: "Sets the restricted members for current giveaway",
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
        ctx.requirements.restrictedMembers = members.map((x) => x.id)
        return this.success()
    }
})