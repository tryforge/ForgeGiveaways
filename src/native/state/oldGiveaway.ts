import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { GiveawayProperties, GiveawayProperty } from "../../properties/giveaway"

export default new NativeFunction({
    name: "$oldGiveaway",
    version: "1.0.0",
    description: "Retrieves old data from an event whose context was a giveaway instance",
    unwrap: true,
    brackets: false,
    args: [
        {
            name: "property",
            description: "The property of the giveaway to return",
            rest: false,
            required: true,
            type: ArgType.Enum,
            enum: GiveawayProperty
        },
        {
            name: "separator",
            description: "The separator to use in case of array",
            rest: false,
            type: ArgType.String
        }
    ],
    output: ArgType.Unknown,
    execute(ctx, [prop, sep]) {
        const giveaway = ctx.extendedStates?.giveaway?.old
        if (!giveaway || prop) return this.success(GiveawayProperties[prop](giveaway, sep))
        return this.successJSON(giveaway)
    }
})