"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const getGiveaway_1 = __importDefault(require("../functions/getGiveaway"));
const array_1 = __importDefault(require("../functions/array"));
exports.default = new forgescript_1.NativeFunction({
    name: "$giveawayRequiredRoles",
    description: "Returns the required roles for a giveaway",
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
    execute(ctx, [id, sep]) {
        const giveaway = (0, getGiveaway_1.default)(ctx, id);
        return this.success(giveaway?.requirements?.requiredRoles?.join(sep ?? ", "));
    }
});
//# sourceMappingURL=giveawayRequiredRoles.js.map