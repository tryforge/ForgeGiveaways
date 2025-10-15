"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
class GiveawaysEventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        // @ts-ignore
        client.getExtension(__1.ForgeGiveaways, true).emitter.on(this.name, this.listener.bind(client));
    }
}
exports.GiveawaysEventHandler = GiveawaysEventHandler;
//# sourceMappingURL=GiveawaysEventManager.js.map