"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayCommandManager = void 0;
const forgescript_1 = require("forgescript");
const index_1 = require("../index");
class GiveawayCommandManager extends forgescript_1.BaseCommandManager {
    constructor() {
        super(...arguments);
        this.handlerName = index_1.GIVEAWAY_STORAGE_NAME;
    }
}
exports.GiveawayCommandManager = GiveawayCommandManager;
