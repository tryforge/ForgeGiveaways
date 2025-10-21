"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const structures_1 = require("../structures");
async function default_1(ctx, id) {
    return (id ? await structures_1.Database.get(id) : ctx.giveaway ?? ctx.extendedStates?.giveaway?.new);
}
//# sourceMappingURL=pullGiveaway.js.map