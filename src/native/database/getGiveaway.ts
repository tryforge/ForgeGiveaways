import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { GiveawayProperties, GiveawayProperty } from "../../properties/giveaway"
import { Database } from "../.."

export default new NativeFunction({
    name: "$getGiveaway",
    version: "1.0.0",
    description: "Gets an existing giveaway from the database",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to get",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "property",
            description: "The property of the giveaway to return",
            rest: false,
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
    output: [
        ArgType.Json,
        ArgType.Unknown
    ],
    async execute(ctx, [id, prop, sep]) {
        const giveaway = await Database.get(id)
        if (!giveaway) return this.success()

        if (prop) return this.success(GiveawayProperties[prop](giveaway, sep))
        return this.successJSON(giveaway)
    }
})