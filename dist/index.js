"use strict";
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
//# sourceMappingURL=index.js.map