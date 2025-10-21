"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const pullGiveaway_1 = __importDefault(require("../functions/pullGiveaway"));
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayWinnersCount",
    version: "1.0.0",
    description: "Returns the winners count of a giveaway",
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
    ],
    output: forgescript_1.ArgType.Number,
    async execute(ctx, [id]) {
        const giveaway = await (0, pullGiveaway_1.default)(ctx, id);
        return this.success(giveaway?.winnersCount);
    }
});
//# sourceMappingURL=giveawayWinnersCount.js.map