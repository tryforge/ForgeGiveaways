"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysInteractionManager = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
class GiveawaysInteractionManager {
    client;
    constructor(client) {
        this.client = client;
        this._register();
    }
    _register() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton() || !interaction.customId.startsWith("giveawayEntry-"))
                return;
            const [, id] = interaction.customId.split("-");
            const client = this.client.getExtension(__1.ForgeGiveaways, true);
            const giveaway = client.giveawaysManager.get(id);
            if (!giveaway)
                return;
            const member = interaction.member;
            if (!(member instanceof discord_js_1.GuildMember && giveaway.canEnter(member)))
                return;
            const oldGiveaway = giveaway;
            const entered = giveaway.hasEntered(member.id);
            if (entered) {
                giveaway.removeEntry(member.id);
                client.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway);
            }
            else {
                giveaway.addEntry(member.id);
                client.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway);
            }
            interaction.reply({
                content: `You have successfully ${entered ? "left" : "entered"} the giveaway.`,
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        });
    }
}
exports.GiveawaysInteractionManager = GiveawaysInteractionManager;
//# sourceMappingURL=GiveawaysInteractionManager.js.map