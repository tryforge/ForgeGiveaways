import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
    name: "$setRestrictedRoles",
    version: "1.0.0",
    description: "Sets the restricted roles for current giveaway",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "roles",
            description: "The roles to add as restriction",
            rest: true,
            required: true,
            type: ArgType.String,
        },
    ],
    execute(ctx, [roles]) {
        ctx.requirements ??= {}
        ctx.requirements.restrictedRoles = roles
        return this.success()
    }
})