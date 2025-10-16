"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const __1 = require("..");
function default_1(ctx, id) {
    return (ctx.client.getExtension(__1.ForgeGiveaways, true).giveawaysManager.get(id) ?? ctx.giveaway);
}
//# sourceMappingURL=getGiveaway.js.map