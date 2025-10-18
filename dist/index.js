"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeGiveaways = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const managers_1 = require("./managers");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const structures_1 = require("./structures");
class ForgeGiveaways extends forgescript_1.ForgeExtension {
    options;
    name = "ForgeGiveaways";
    description = "";
    version = require("../package.json").version;
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    giveawaysManager = new managers_1.GiveawaysManager(this, this.emitter);
    database;
    commands;
    constructor(options) {
        super();
        this.options = options;
        this.commands = null;
        this.database = new structures_1.Database(this.emitter);
    }
    async init(client) {
        this.commands = new managers_1.GiveawaysCommandManager(client);
        forgescript_1.EventManager.load("ForgeGiveawaysEvents", __dirname + "/events");
        this.load(__dirname + "/native");
        new managers_1.GiveawaysInteractionManager(client);
        if (this.options?.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events);
        }
        await this.database.init();
    }
}
exports.ForgeGiveaways = ForgeGiveaways;
//# sourceMappingURL=index.js.map