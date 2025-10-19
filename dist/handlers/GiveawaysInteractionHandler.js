"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysInteractionHandler = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const structures_1 = require("../structures");
class GiveawaysInteractionHandler {
    client;
    constructor(client) {
        this.client = client;
        this._register();
    }
    async _register() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton() || !interaction.customId.startsWith("giveawayEntry-"))
                return;
            const [, id] = interaction.customId.split("-");
            const client = this.client.getExtension(__1.ForgeGiveaways, true);
            const giveaway = await structures_1.Database.get(id);
            if (!giveaway)
                return;
            const member = interaction.member;
            if (!(member instanceof discord_js_1.GuildMember && giveaway.canEnter(member)))
                return;
            const oldGiveaway = giveaway.clone();
            const entered = giveaway.hasEntered(member.id);
            if (entered) {
                giveaway.removeEntry(member.id);
                await structures_1.Database.set(giveaway);
                client.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway);
            }
            else {
                giveaway.addEntry(member.id);
                await structures_1.Database.set(giveaway);
                client.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway);
            }
            interaction.reply({
                content: `You have successfully ${entered ? "left" : "entered"} the giveaway.`,
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        });
    }
}
exports.GiveawaysInteractionHandler = GiveawaysInteractionHandler;
//# sourceMappingURL=GiveawaysInteractionHandler.js.map