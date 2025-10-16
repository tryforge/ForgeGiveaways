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
     */
    get(id) {
        return this.giveaways.get(id);
    }
    /**
     * Starts a new giveaway on a guild.
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns
     */
    async start(ctx, options) {
        const giveaway = new structures_1.Giveaway(options);
        const result = await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: forgescript_1.Compiler.compile(this.client.options?.messages?.start || `
                $sendMessage[$env[giveaway;channelID];
                    $title[🎉 GIVEAWAY 🎉]
                    $description[**Prize:** $env[giveaway;prize]\n**Winners:** $env[giveaway;winnersCount]]
                    $addField[Ends;<t:$floor[$math[($getTimestamp+$env[giveaway;duration])/1000]]:R>;true]
                    $addField[Hosted by;<@$env[giveaway;hostID]>;true]
                    $color[Green]
                    $addActionRow
                    $addButton[giveaway;Enter;Primary]
                ;true]
            `),
            doNotSend: true,
        });
        const res = result?.trim();
        const chan = ctx.client.channels.cache.get(giveaway.channelID);
        giveaway.messageID = (res && chan?.messages.cache.get(res) ? res : undefined);
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
        const giveaway = this.giveaways.get(id);
        if (!giveaway)
            return null;
        const eligibleEntries = giveaway.entries.filter(entry => {
            const member = ctx.guild?.members.cache.get(entry);
            if (!member)
                return false;
            const { requirements } = giveaway;
            const hasRequiredRoles = requirements?.requiredRoles?.every((x) => member.roles.cache.has(x)) ?? true;
            const noRestrictedRoles = requirements?.restrictedRoles?.every((x) => !member.roles.cache.has(x)) ?? true;
            const notRestrictedMember = !requirements?.restrictedMembers?.includes(member.id);
            return hasRequiredRoles && noRestrictedRoles && notRestrictedMember;
        });
        const winners = this.pickWinners(eligibleEntries, giveaway.winnersCount);
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
        const giveaway = this.giveaways.get(id);
        if (!giveaway)
            return null;
        const oldGiveaway = giveaway;
        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e));
        const newWinners = this.pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = newWinners;
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: forgescript_1.Compiler.compile(this.client.options?.messages?.reroll),
            doNotSend: true,
        });
        this.emitter.emit("giveawayReroll", giveaway, oldGiveaway);
        return giveaway;
    }
    pickWinners(entries, amount) {
        const shuffled = entries.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
}
exports.GiveawaysManager = GiveawaysManager;
//# sourceMappingURL=GiveawaysManager.js.map