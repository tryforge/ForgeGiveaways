import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { GiveawayProperties, GiveawayProperty } from "../../properties/giveaway"
import { Database } from "../.."
import array from "../../functions/array"

export default new NativeFunction({
    name: "$getAllGiveaways",
    version: "1.0.0",
    description: "Gets all existing giveaways from the database",
    unwrap: true,
    brackets: false,
    args: [
        {
            name: "property",
            description: "The property of the giveaways to return",
            rest: false,
            required: true,
            type: ArgType.Enum,
            enum: GiveawayProperty
        },
        {
            name: "separator",
            description: "The separator to use for each property",
            rest: false,
            type: ArgType.String
        }
    ],
    output: [
        ArgType.Json,
        array<ArgType.Unknown>()
    ],
    async execute(ctx, [prop, sep]) {
        const giveaways = await Database.getAll()
        if (prop) return this.success(giveaways.map((x) => GiveawayProperties[prop](x, sep)).join(sep ?? ", "))
        return this.successJSON(giveaways)
    }
})