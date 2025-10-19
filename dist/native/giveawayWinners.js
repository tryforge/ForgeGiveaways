"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("../structures");
const array_1 = __importDefault(require("../functions/array"));
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayWinners",
    version: "1.0.0",
    description: "Returns the winners of a giveaway",
    unwrap: true,
    brackets: false,
    args: [
        {
            name: "giveaway ID",
            description: "The giveaway to pull data from",
            rest: false,
            required: true,
            type: forgescript_1.ArgType.String,
        },
        {
            name: "separator",
            description: "The separator to use for each value",
            rest: false,
            type: forgescript_1.ArgType.String,
        },
    ],
    output: (0, array_1.default)(),
    async execute(ctx, [id, sep]) {
        const giveaway = this.hasFields ? await structures_1.Database.get(id) : ctx.giveaway;
        return this.success(giveaway?.winners.join(sep ?? ", "));
    }
});
//# sourceMappingURL=giveawayWinners.js.map