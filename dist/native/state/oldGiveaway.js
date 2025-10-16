"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const giveaway_1 = require("../../properties/giveaway");
exports.default = new forgescript_1.NativeFunction({
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
    output: forgescript_1.ArgType.Unknown,
    execute(ctx, [prop, sep]) {
        const giveaway = ctx.extendedStates?.giveaway?.old;
        if (!giveaway || prop)
            return this.success(giveaway_1.GiveawayProperties[prop](giveaway, sep));
        return this.successJSON(giveaway);
    }
});
//# sourceMappingURL=oldGiveaway.js.map