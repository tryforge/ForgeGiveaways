"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeGiveaways = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const managers_1 = require("./managers");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const structures_1 = require("./structures");
class ForgeGiveaways extends forgescript_1.ForgeExtension {
    options;
    name = "forge.giveaways";
    description = require("../package.json").description;
    version = require("../package.json").version;
    requireExtensions = ["forge.db"];
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    giveawaysManager;
    commands;
    constructor(options = {}) {
        super();
        this.options = options;
        this.options.useDefault ??= true;
    }
    async init(client) {
        this.commands = new managers_1.GiveawaysCommandManager(client);
        forgescript_1.EventManager.load("ForgeGiveawaysEvents", __dirname + "/events");
        this.load(__dirname + "/native");
        new managers_1.GiveawaysInteractionHandler(client);
        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events);
        }
        await new structures_1.Database(this.emitter).init();
        this.giveawaysManager = new managers_1.GiveawaysManager(this, client);
    }
}
exports.ForgeGiveaways = ForgeGiveaways;
__exportStar(require("./managers"), exports);
__exportStar(require("./structures"), exports);
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map