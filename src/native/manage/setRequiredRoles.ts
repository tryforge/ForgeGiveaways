import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
    name: "$setRequiredRoles",
    version: "1.0.0",
    description: "Sets the required roles for current giveaway",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "roles",
            description: "The roles to add as requirement",
            rest: true,
            required: true,
            type: ArgType.String,
        },
    ],
    execute(ctx, [roles]) {
        ctx.requirements.requiredRoles = roles
        return this.success()
    }
})