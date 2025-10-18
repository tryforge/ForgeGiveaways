import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
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
            type: ArgType.String,
        },
    ],
    execute(ctx, [roles]) {
        ctx.requirements ??= {}
        
        const set = new Set(ctx.requirements.restrictedRoles)
        for (const role of roles) set.add(role)

        ctx.requirements.restrictedRoles = [...set]
        return this.success()
    }
})