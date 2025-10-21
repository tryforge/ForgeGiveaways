"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysInteractionHandler = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const structures_1 = require("../structures");
const error_1 = require("../functions/error");
const noop_1 = __importDefault(require("../functions/noop"));
class GiveawaysInteractionHandler {
    client;
    constructor(client) {
        this.client = client;
        this._register();
    }
    async _register() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton() || !interaction.inGuild())
                return;
            const [action, id] = interaction.customId.split("-");
            if (action !== "giveawayEntry")
                return;
            const client = this.client.getExtension(__1.ForgeGiveaways, true);
            const giveaway = await structures_1.Database.get(id);
            if (!giveaway) {
                (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.UnknownGiveaway, id);
                return;
            }
            if (giveaway.hasEnded) {
                (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.GiveawayNotActive, id);
                return;
            }
            const member = interaction.member;
            if (!giveaway.canEnter(member)) {
                client.emitter.emit("giveawayEntryRevoked", giveaway, interaction);
                if (client.options.useDefault) {
                    await interaction.reply({
                        content: `❌ You do not meet the requirements to enter this giveaway!`,
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    }).catch(noop_1.default);
                }
                return;
            }
            const oldGiveaway = giveaway.clone();
            const entered = giveaway.hasEntered(member.user.id);
            if (entered) {
                giveaway.removeEntry(member.user.id);
                await structures_1.Database.set(giveaway).catch(noop_1.default);
                client.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway, interaction);
            }
            else {
                giveaway.addEntry(member.user.id);
                await structures_1.Database.set(giveaway).catch(noop_1.default);
                client.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway, interaction);
            }
            if (client.options.useDefault) {
                await interaction.reply({
                    content: `✅ You have successfully ${entered ? "left" : "joined"} this giveaway.`,
                    flags: discord_js_1.MessageFlags.Ephemeral,
                }).catch(noop_1.default);
            }
        });
    }
}
exports.GiveawaysInteractionHandler = GiveawaysInteractionHandler;
//# sourceMappingURL=GiveawaysInteractionHandler.js.map