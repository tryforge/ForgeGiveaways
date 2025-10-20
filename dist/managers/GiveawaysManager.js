"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysManager = void 0;
const discord_js_1 = require("discord.js");
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("../structures");
const error_1 = require("../functions/error");
const noop_1 = __importDefault(require("../functions/noop"));
class GiveawaysManager {
    giveaways;
    client;
    constructor(giveaways, client) {
        this.giveaways = giveaways;
        this.client = client;
        client.once("clientReady", () => this._restoreGiveaways());
    }
    /**
     * Starts a new giveaway on a guild.
     * @param options The start options for the giveaway.
     * @returns
     */
    async start(ctx, options) {
        const giveaway = new structures_1.Database.entities.Giveaway(options);
        const chan = this.client.channels.cache.get(giveaway.channelID);
        let msg;
        if (this.giveaways.options.useDefault) {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("🎉 GIVEAWAY 🎉")
                .setDescription(`🎁 **Prize:** ${giveaway.prize}\n🏆 **Winners:** ${giveaway.winnersCount}`)
                .setFields({ name: "Ends", value: `${(0, discord_js_1.time)(new Date(Date.now() + giveaway.timeLeft()), "R")}`, inline: true }, { name: "Hosted by", value: `<@${giveaway.hostID}>`, inline: true })
                .setFooter({ text: "Click the button below to join!" })
                .setTimestamp()
                .setColor("Green");
            const comps = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`giveawayEntry-${giveaway.id}`)
                .setLabel("Join")
                .setEmoji("🎉")
                .setStyle(discord_js_1.ButtonStyle.Success));
            msg = await chan?.send({
                embeds: [embed],
                components: [comps.toJSON()]
            }).catch(noop_1.default);
        }
        else if (this.giveaways.options.startMessage) {
            const result = await forgescript_1.Interpreter.run({
                ...ctx.runtime,
                environment: { giveaway },
                data: forgescript_1.Compiler.compile(this.giveaways.options.startMessage),
                allowTopLevelReturn: true,
                doNotSend: true,
            });
            msg = await this._fetchMessage(giveaway.channelID, result?.trim());
        }
        else {
            (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.NoStartMessage);
            return;
        }
        if (!msg) {
            (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotDetermined, giveaway.id);
            return;
        }
        giveaway.messageID = msg.id;
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.giveaways.emitter.emit("giveawayStart", giveaway);
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
            return;
        giveaway.hasEnded = true;
        const guild = this.client.guilds.cache.get(giveaway.guildID);
        const eligibleEntries = giveaway.entries.filter((e) => {
            const member = guild?.members.cache.get(e);
            return member && giveaway.canEnter(member);
        });
        const winners = this._pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = winners;
        if (this.giveaways.options.useDefault) {
            const msg = await this._fetchMessage(giveaway.channelID, giveaway.messageID);
            if (msg) {
                const plural = winners.length === 1 ? "" : "s";
                const mentions = this._parseMentions(winners);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .setDescription(`🎁 **Prize:** ${giveaway.prize}\n🏆 **Winner${plural}:** ${mentions || "None"}\n👥 **Total Entries:** ${giveaway.entries.length}`)
                    .addFields({ name: "Ended", value: `${(0, discord_js_1.time)(new Date(), "R")}`, inline: true }, { name: "Hosted by", value: `<@${giveaway.hostID}>`, inline: true })
                    .setFooter({ text: "Thanks for participating!" })
                    .setTimestamp(giveaway.timestamp)
                    .setColor("Red");
                msg.edit({
                    embeds: [embed],
                    components: []
                }).catch(noop_1.default);
                msg.reply({
                    content: winners.length
                        ? `🎉 Congratulations to the winner${plural} of **${giveaway.prize}**!\n🏆 **Winner${plural}:** ${mentions}`
                        : "😢 No winners for this giveaway!",
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(noop_1.default);
            }
            else {
                (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotFound, giveaway.id);
                return;
            }
        }
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.giveaways.emitter.emit("giveawayEnd", giveaway);
        return giveaway;
    }
    /**
     * Rerolls an existing giveaway.
     * @param id The id of the giveaway to reroll.
     * @param unique Whether to not include the previous winners.
     * @param amount The amount of new winners.
     * @returns
     */
    async reroll(id, unique = false, amount) {
        const giveaway = await structures_1.Database.get(id);
        if (!giveaway || !giveaway.hasEnded || !giveaway.winners.length)
            return;
        const oldGiveaway = giveaway.clone();
        amount ??= giveaway.winnersCount;
        const { entries, winners } = giveaway;
        const eligibleEntries = unique ? entries.filter((e) => !winners.includes(e)) : entries;
        let newWinners = this._pickWinners(eligibleEntries, amount);
        if (!newWinners.length)
            newWinners = this._pickWinners(entries, amount);
        giveaway.winners = newWinners;
        if (this.giveaways.options.useDefault) {
            const msg = await this._fetchMessage(giveaway.channelID, giveaway.messageID);
            if (msg) {
                const plural = newWinners.length === 1 ? "" : "s";
                msg.reply({
                    content: `🔁 Rerolled giveaway, congratulations to the new winner${plural}!\n🏆 **New Winner${plural}:** ${this._parseMentions(newWinners)}`,
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(noop_1.default);
            }
            else {
                (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotFound, giveaway.id);
                return;
            }
        }
        await structures_1.Database.set(giveaway).catch(noop_1.default);
        this.giveaways.emitter.emit("giveawayReroll", oldGiveaway, giveaway);
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
        this.giveaways.emitter.emit("giveawayEdit", oldGiveaway, giveaway);
        return giveaway;
    }
    /**
     * Randomly picks X amount of winners from the provided entries.
     * @param entries The entries to pick winners from.
     * @param amount The amount of winners to pick.
     * @returns
     */
    _pickWinners(entries, amount) {
        const shuffled = [...entries].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
    /**
     * Parses the mentions for all giveaway winners.
     * @param winners The winners to parse mentions for.
     * @returns
     */
    _parseMentions(winners) {
        return winners.map((id) => `<@${id}>`).join(", ");
    }
    /**
     * Fetches the message of a giveaway.
     * @param data The giveaway data to use.
     * @returns
     */
    async _fetchMessage(channelID, messageID) {
        if (!messageID)
            return;
        const chan = this.client.channels.cache.get(channelID);
        return await chan?.messages.fetch(messageID).catch(() => { });
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