"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeGiveaways = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const managers_1 = require("./managers");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const structures_1 = require("./structures");
class ForgeGiveaways extends forgescript_1.ForgeExtension {
    options;
    name = "forge.giveaways";
    description = "";
    version = require("../package.json").version;
    requireExtensions = ["forge.db"];
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    giveawaysManager = new managers_1.GiveawaysManager(this, this.emitter);
    commands;
    constructor(options) {
        super();
        this.options = options;
        this.commands = null;
    }
    init(client) {
        this.commands = new managers_1.GiveawaysCommandManager(client);
        forgescript_1.EventManager.load("ForgeGiveawaysEvents", __dirname + "/events");
        this.load(__dirname + "/native");
        new managers_1.GiveawaysInteractionManager(client);
        new structures_1.Database(this.emitter).init();
        client.db = structures_1.Database;
        if (this.options?.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events);
        }
    }
}
exports.ForgeGiveaways = ForgeGiveaways;
//# sourceMappingURL=index.js.map