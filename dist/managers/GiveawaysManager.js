"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysManager = void 0;
const discord_js_1 = require("discord.js");
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("../structures");
const error_1 = require("../functions/error");
class GiveawaysManager {
    giveaways;
    client;
    emitter;
    constructor(giveaways, client, emitter) {
        this.giveaways = giveaways;
        this.client = client;
        this.emitter = emitter;
        this._checkGiveaways();
    }
    /**
     * Starts a new giveaway on a guild.
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns
     */
    async start(ctx, options) {
        const giveaway = new structures_1.Giveaway(options);
        const chan = ctx.client.channels.cache.get(giveaway.channelID);
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
            }).catch(ctx.noop);
            if (!msg) {
                (0, error_1.throwGiveawaysError)(error_1.GiveawaysErrorType.MessageNotFound, giveaway.id);
                return;
            }
            giveaway.messageID = msg.id;
        }
        await structures_1.Database.set(giveaway).catch(ctx.noop);
        this.emitter.emit("giveawayStart", giveaway);
        setTimeout(async () => await this.end(giveaway.id, ctx), giveaway.duration);
        return giveaway;
    }
    /**
     * Ends an existing giveaway.
     * @param id The id of the giveaway to end.
     * @param ctx The optional current context.
     * @returns
     */
    async end(id, ctx) {
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
            const msg = giveaway.messageID ? await chan?.messages.fetch(giveaway.messageID).catch(ctx?.noop) : undefined;
            if (msg) {
                const oldEmbed = msg.embeds[0];
                const embed = discord_js_1.EmbedBuilder.from(oldEmbed)
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .spliceFields(0, 1, { name: "Ended", value: oldEmbed.fields[0].value, inline: true })
                    .setColor("Red");
                msg.edit({
                    embeds: [embed],
                    components: []
                }).catch(ctx?.noop);
                const plural = winners.length > 1 ? "s" : "";
                msg.reply({
                    content: winners.length === 0
                        ? "😢 No winners for this giveaway!"
                        : `🎉 Congratulations to the winner${plural} of **${giveaway.prize}**!\n> 🏆 **Winner${plural}:** ${winners.map((id) => `<@${id}>`).join(", ")}`,
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(ctx?.noop);
            }
        }
        await structures_1.Database.set(giveaway).catch(ctx?.noop);
        this.emitter.emit("giveawayEnd", giveaway);
        return giveaway;
    }
    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns
     */
    async reroll(ctx, id) {
        const giveaway = await structures_1.Database.get(id);
        if (!giveaway || !giveaway.hasEnded)
            return null;
        const oldGiveaway = giveaway.clone();
        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e));
        const newWinners = this._pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = newWinners;
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: forgescript_1.Compiler.compile(this.giveaways.options?.messages?.reroll),
            doNotSend: true,
        });
        await structures_1.Database.set(giveaway).catch(ctx.noop);
        this.emitter.emit("giveawayReroll", oldGiveaway, giveaway);
        return giveaway;
    }
    _pickWinners(entries, amount) {
        const shuffled = entries.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
    async _checkGiveaways() {
        const giveaways = await structures_1.Database.getAll();
        if (!giveaways)
            return;
        for (const giveaway of giveaways) {
            if (giveaway.hasEnded)
                continue;
            if (giveaway.timeLeft() > 0) {
                setTimeout(async () => await this.end(giveaway.id), giveaway.timeLeft());
            }
            else {
                await this.end(giveaway.id);
            }
        }
    }
}
exports.GiveawaysManager = GiveawaysManager;
//# sourceMappingURL=GiveawaysManager.js.map