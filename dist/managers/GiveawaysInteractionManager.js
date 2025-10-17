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
            if (giveaway.hasEntered(member.id)) {
                const newGiveaway = giveaway.removeEntry(member.id);
                if (newGiveaway)
                    client.emitter.emit("giveawayEntryRemove", newGiveaway, giveaway);
            }
            else {
                const newGiveaway = giveaway.addEntry(member.id);
                if (newGiveaway)
                    client.emitter.emit("giveawayEntryAdd", newGiveaway, giveaway);
            }
        });
    }
}
exports.GiveawaysInteractionManager = GiveawaysInteractionManager;
//# sourceMappingURL=GiveawaysInteractionManager.js.map