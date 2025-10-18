import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
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
            type: ArgType.String,
        },
    ],
    execute(ctx, [roles]) {
        ctx.requirements ??= {}

        const set = new Set(ctx.requirements.requiredRoles)
        for (const role of roles) set.add(role)

        ctx.requirements.requiredRoles = [...set]
        return this.success()
    }
})