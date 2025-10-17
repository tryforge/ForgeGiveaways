"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const getGiveaway_1 = __importDefault(require("../functions/getGiveaway"));
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayGuildID",
    version: "1.0.0",
    description: "Returns the guild id of a giveaway",
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
    output: forgescript_1.ArgType.Guild,
    execute(ctx, [id]) {
        const giveaway = (0, getGiveaway_1.default)(ctx, id) ?? ctx.giveaway;
        return this.success(giveaway?.guildID);
    }
});
//# sourceMappingURL=giveawayGuildID.js.map