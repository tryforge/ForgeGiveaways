"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const discord_js_1 = require("discord.js");
const structures_1 = require("../structures");
class GiveawaysManager {
    client;
    emitter;
    giveaways = new discord_js_1.Collection();
    constructor(client, emitter) {
        this.client = client;
        this.emitter = emitter;
    }
    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns
     */
    get(id) {
        return this.giveaways.get(id);
    }
    /**
     * Gets all existing giveaways.
     * @returns
     */
    getAll() {
        return this.giveaways;
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
        if (this.client.options?.messages?.start) {
            const result = await forgescript_1.Interpreter.run({
                ...ctx.runtime,
                environment: { giveaway },
                data: forgescript_1.Compiler.compile(this.client.options?.messages?.start),
                doNotSend: true,
            });
            const res = result?.trim();
            giveaway.messageID = (res && chan?.messages.cache.get(res) ? res : undefined);
        }
        else {
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
            });
            giveaway.messageID = msg?.id;
        }
        this.emitter.emit("giveawayStart", giveaway);
        this.giveaways.set(giveaway.id, giveaway);
        setTimeout(() => this.end(ctx, giveaway.id), giveaway.duration);
        return giveaway;
    }
    /**
     * Ends an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to end.
     * @returns
     */
    async end(ctx, id) {
        const giveaway = this.get(id);
        if (!giveaway || giveaway.hasEnded)
            return null;
        giveaway.hasEnded = true;
        const guild = ctx.client.guilds.cache.get(giveaway.guildID);
        const eligibleEntries = giveaway.entries.filter((e) => {
            const member = guild?.members.cache.get(e);
            return member && giveaway.canEnter(member);
        });
        const winners = this._pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = winners;
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: forgescript_1.Compiler.compile(this.client.options?.messages?.end || `
                $!editMessage[$env[giveaway;channelID];$env[giveaway;messageID];
                    $fetchEmbeds[$env[giveaway;channelID];$env[giveaway;messageID]]
                    $title[🎉 GIVEAWAY ENDED 🎉]
                    $color[Red]
                ]
            `),
            doNotSend: true,
        });
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
        const giveaway = this.get(id);
        if (!giveaway || !giveaway.hasEnded)
            return null;
        const oldGiveaway = giveaway.clone();
        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e));
        const newWinners = this._pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = newWinners;
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: forgescript_1.Compiler.compile(this.client.options?.messages?.reroll),
            doNotSend: true,
        });
        this.emitter.emit("giveawayReroll", oldGiveaway, giveaway);
        return giveaway;
    }
    _pickWinners(entries, amount) {
        const shuffled = entries.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
}
exports.GiveawaysManager = GiveawaysManager;
//# sourceMappingURL=GiveawaysManager.js.map