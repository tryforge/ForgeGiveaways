"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const giveaway_1 = require("../../properties/giveaway");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: "$getGiveaway",
    description: "Gets an existing giveaway from the database",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to get",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "property",
            description: "The property of the giveaway to return",
            rest: false,
            type: forgescript_1.ArgType.Enum,
            enum: giveaway_1.GiveawayProperty
        },
        {
            name: "separator",
            description: "The separator to use in case of array",
            rest: false,
            type: forgescript_1.ArgType.String
        }
    ],
    output: [
        forgescript_1.ArgType.Json,
        forgescript_1.ArgType.Unknown
    ],
    async execute(ctx, [id, prop, sep]) {
        const giveaway = await __1.Database.get(id);
        if (!giveaway)
            return this.success();
        if (prop)
            return this.success(giveaway_1.GiveawayProperties[prop](giveaway, sep));
        return this.successJSON(giveaway);
    }
});
//# sourceMappingURL=getGiveaway.js.map