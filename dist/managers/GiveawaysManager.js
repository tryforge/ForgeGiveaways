"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysManager = void 0;
const discord_js_1 = require("discord.js");
const structures_1 = require("../structures");
const error_1 = require("../functions/error");
const noop_1 = __importDefault(require("../functions/noop"));
class GiveawaysManager {
    giveaways;
    client;
    emitter;
    constructor(giveaways, client, emitter) {
        this.giveaways = giveaways;
        this.client = client;
        this.emitter = emitter;
        client.once("clientReady", () => this._restoreGiveaways());
    }
    /**
     * Starts a new giveaway on a guild.
     * @param options The start options for the giveaway.
     * @returns
     */
    async start(options) {
        const giveaway = new structures_1.Giveaway(options);
        const chan = this.client.channels.cache.get(giveaway.channelID);
        if (this.giveaways.options.useDefault) {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("🎉 GIVEAWAY 🎉")
                .setDescription(`**Prize:** ${giveaway.prize}\n**Winners:** ${giveaway.winnersCount}`)
                .setFields({ name: "Ends", value: `${(0, discord_js_1.time)(new Date(Date.now() + giveaway.duration), "R")}`, inline: true }, { name: "Hosted by", value: `<@${giveaway.hostID}>`, inline: true })
                .setColor("Green");
            const comps = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`giveawayEntry-${giveaway.id}`)
                .setLabel("Entry")
                .setStyle(discord_js_1.ButtonStyle.Primary));
            const msg = await chan?.send({
                embeds: [embed],
                components: [comps.toJSON()]
            }).catch(noop_1.default);
            if (!msg) {
                (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotFound, giveaway.id);
                return;
            }
            giveaway.messageID = msg.id;
        }
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.emitter.emit("giveawayStart", giveaway);
        setTimeout(async () => await this.end(giveaway.id).catch(noop_1.default), giveaway.duration);
        return giveaway;
    }
    /**
     * Ends an existing giveaway.
     * @param id The id of the giveaway to end.
     * @returns
     */
    async end(id) {
        const giveaway = await structures_1.Database.get(id);
        if (!giveaway || giveaway.hasEnded)
            return null;
        giveaway.hasEnded = true;
        const guild = this.client.guilds.cache.get(giveaway.guildID);
        const eligibleEntries = giveaway.entries.filter((e) => {
            const member = guild?.members.cache.get(e);
            return member && giveaway.canEnter(member);
        });
        const winners = this._pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = winners;
        if (this.giveaways.options.useDefault) {
            const chan = this.client.channels.cache.get(giveaway.channelID);
            const msg = giveaway.messageID ? await chan?.messages.fetch(giveaway.messageID).catch(noop_1.default) : undefined;
            if (msg) {
                const oldEmbed = msg.embeds[0];
                const embed = discord_js_1.EmbedBuilder.from(oldEmbed)
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .spliceFields(0, 1, { name: "Ended", value: oldEmbed.fields[0].value, inline: true })
                    .setColor("Red");
                msg.edit({
                    embeds: [embed],
                    components: []
                }).catch(noop_1.default);
                const plural = winners.length > 1 ? "s" : "";
                msg.reply({
                    content: winners.length === 0
                        ? "😢 No winners for this giveaway!"
                        : `🎉 Congratulations to the winner${plural} of **${giveaway.prize}**!\n> 🏆 **Winner${plural}:** ${winners.map((id) => `<@${id}>`).join(", ")}`,
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(noop_1.default);
            }
        }
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.emitter.emit("giveawayEnd", giveaway);
        return giveaway;
    }
    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns
     */
    async reroll(id) {
        const giveaway = await structures_1.Database.get(id);
        if (!giveaway || !giveaway.hasEnded)
            return null;
        const oldGiveaway = giveaway.clone();
        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e));
        const newWinners = this._pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = newWinners;
        if (this.giveaways.options.useDefault) { }
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.emitter.emit("giveawayReroll", oldGiveaway, giveaway);
        return giveaway;
    }
    /**
     * Edits an existing giveaway.
     * @param id The id of the giveaway to edit.
     * @param options The options used to edit this giveaway.
     */
    async edit(id, options) {
        const giveaway = await structures_1.Database.get(id);
        if (!giveaway || giveaway.hasEnded)
            return null;
        const oldGiveaway = giveaway.clone();
        if (options.prize)
            giveaway.prize = options.prize;
        if (options.duration)
            giveaway.duration = options.duration;
        if (options.winnersCount)
            giveaway.winnersCount = options.winnersCount;
        if (options.hostID)
            giveaway.hostID = options.hostID;
        if (options.requirements)
            giveaway.requirements = options.requirements;
        if (this.giveaways.options.useDefault) { }
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.emitter.emit("giveawayEdit", oldGiveaway, giveaway);
        return giveaway;
    }
    /**
     * Randomly picks X amount of winners from the provided entries.
     * @param entries The entries to pick winners from.
     * @param amount The amount of winners to pick.
     * @returns
     */
    _pickWinners(entries, amount) {
        const shuffled = entries.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
    /**
     * Restores all active giveaways on startup.
     * @returns
     */
    async _restoreGiveaways() {
        const giveaways = await structures_1.Database.getAll();
        if (!giveaways)
            return;
        for (const giveaway of giveaways) {
            if (giveaway.hasEnded)
                continue;
            if (giveaway.timeLeft() > 0) {
                setTimeout(async () => await this.end(giveaway.id).catch(noop_1.default), giveaway.timeLeft());
            }
            else {
                await this.end(giveaway.id).catch(noop_1.default);
            }
        }
    }
}
exports.GiveawaysManager = GiveawaysManager;
//# sourceMappingURL=GiveawaysManager.js.map