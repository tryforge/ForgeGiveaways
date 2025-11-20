"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysReactionHandler = void 0;
const structures_1 = require("../structures");
const __1 = require("..");
const noop_1 = __importDefault(require("../functions/noop"));
class GiveawaysReactionHandler {
    client;
    emitter;
    constructor(client) {
        this.client = client;
        this.emitter = client.getExtension(__1.ForgeGiveaways, true).emitter;
        this._register();
    }
    async _register() {
        // Add Entry
        this.client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot)
                return;
            const { message, users, emoji } = reaction;
            if (emoji.name !== "🎉")
                return;
            const giveaway = await this._find(message.channelId, message.id);
            if (!giveaway || giveaway.hasEnded)
                return;
            const members = this.client.guilds.cache.get(giveaway.guildID)?.members;
            const member = members?.cache.get(user.id) ?? await members?.fetch(user.id).catch(noop_1.default);
            user = user;
            if (!member || !giveaway.canEnter(member)) {
                users.remove(user.id).catch(noop_1.default);
                this.emitter.emit("giveawayEntryRevoke", giveaway, reaction, user);
                return;
            }
            const oldGiveaway = giveaway.clone();
            giveaway.addEntry(user.id);
            await structures_1.Database.set(giveaway).catch(noop_1.default);
            this.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway, reaction, user);
        });
        // Remove Entry
        this.client.on("messageReactionRemove", async (reaction, user) => {
            if (user.bot)
                return;
            const { message, emoji } = reaction;
            if (emoji.name !== "🎉")
                return;
            const giveaway = await this._find(message.channelId, message.id);
            if (!giveaway || giveaway.hasEnded)
                return;
            const oldGiveaway = giveaway.clone();
            giveaway.removeEntry(user.id);
            await structures_1.Database.set(giveaway).catch(noop_1.default);
            this.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway, reaction, user);
        });
    }
    /**
     * Finds an existing giveaway.
     * @param channelID The id of the channel the message is located at.
     * @param messageID The id of the message to get the giveaway from.
     * @returns
     */
    async _find(channelID, messageID) {
        return await structures_1.Database.find({ channelID, messageID }, 1).then((x) => x[0]);
    }
}
exports.GiveawaysReactionHandler = GiveawaysReactionHandler;
//# sourceMappingURL=GiveawaysReactionHandler.js.map