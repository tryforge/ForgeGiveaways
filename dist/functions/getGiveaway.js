"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const __1 = require("..");
async function default_1(ctx, id) {
    return await ctx.client.getExtension(__1.ForgeGiveaways, true).database.get(id);
}
//# sourceMappingURL=getGiveaway.js.map