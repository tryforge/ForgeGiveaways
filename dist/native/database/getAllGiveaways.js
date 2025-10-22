"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const giveaway_1 = require("../../properties/giveaway");
const __1 = require("../..");
const array_1 = __importDefault(require("../../functions/array"));
exports.default = new forgescript_1.NativeFunction({
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
            type: forgescript_1.ArgType.Enum,
            enum: giveaway_1.GiveawayProperty
        },
        {
            name: "separator",
            description: "The separator to use for each property",
            rest: false,
            type: forgescript_1.ArgType.String
        }
    ],
    output: [
        forgescript_1.ArgType.Json,
        (0, array_1.default)()
    ],
    async execute(ctx, [prop, sep]) {
        const giveaways = await __1.Database.getAll();
        if (prop)
            return this.success(giveaways.map((x) => giveaway_1.GiveawayProperties[prop](x, sep)).join(sep ?? ", "));
        return this.successJSON(giveaways);
    }
});
//# sourceMappingURL=getAllGiveaways.js.map