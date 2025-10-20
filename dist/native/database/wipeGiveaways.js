"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: "$wipeGiveaways",
    version: "1.0.0",
    description: "Wipes all existing giveaways from the database permanently, use with caution",
    unwrap: false,
    async execute(ctx) {
        await __1.Database.wipe();
        return this.success();
    }
});
//# sourceMappingURL=wipeGiveaways.js.map