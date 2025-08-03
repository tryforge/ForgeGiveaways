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
const GiveawaysCommandManager_1 = require("./managers/GiveawaysCommandManager");
const discord_giveaways_super_1 = require("discord-giveaways-super");
class ForgeGiveaways extends forgescript_1.ForgeExtension {
    options;
    name = "ForgeGiveaways";
    description = "";
    version = require("../package.json").version;
    commands;
    giveawayManager;
    #path;
    constructor(options) {
        super();
        this.options = options;
        this.commands = null;
        this.giveawayManager = null;
        this.#path = options.path;
    }
    init(client) {
        this.giveawayManager = new discord_giveaways_super_1.Giveaways(client, {
            connection: {
                path: this.#path,
            },
            database: discord_giveaways_super_1.DatabaseType.JSON
        });
        this.commands = new GiveawaysCommandManager_1.GiveawaysCommandManager(client);
        forgescript_1.EventManager.load("ForgeGiveawaysEvents", __dirname + "/events");
        this.load(__dirname + "/native");
        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events);
        }
    }
}
exports.ForgeGiveaways = ForgeGiveaways;
__exportStar(require("./managers"), exports);
//# sourceMappingURL=index.js.map