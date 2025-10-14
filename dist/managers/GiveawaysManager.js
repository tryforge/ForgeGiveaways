"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawaysManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const discord_js_1 = require("discord.js");
class GiveawaysManager {
    client;
    giveaways = new discord_js_1.Collection();
    constructor(client) {
        this.client = client;
    }
    async start(ctx, options) {
        const id = discord_js_1.SnowflakeUtil.generate().toString();
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            data: forgescript_1.Compiler.compile(this.client.options.messages?.start),
            doNotSend: false
        });
        const giveaway = {
            ...options,
            id,
            messageID: "",
            entries: [],
            winners: []
        };
        this.giveaways.set(id, giveaway);
        setTimeout(() => this.end(ctx, id), options.duration);
        return giveaway;
    }
    async end(ctx, id) {
        const giveaway = this.giveaways.get(id);
        if (!giveaway)
            return null;
        const eligibleEntries = giveaway.entries.filter(entry => {
            const member = ctx.guild?.members.cache.get(entry);
            if (!member)
                return false;
            const { requirements } = giveaway;
            const hasRequiredRoles = requirements?.requiredRoles?.every(x => member.roles.cache.has(x)) ?? true;
            const noRestrictedRoles = requirements?.restrictedRoles?.every(x => !member.roles.cache.has(x)) ?? true;
            const notRestrictedMember = !requirements?.restrictedMembers?.includes(member.id);
            return hasRequiredRoles && noRestrictedRoles && notRestrictedMember;
        });
        const winners = this.pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = winners;
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            data: forgescript_1.Compiler.compile(this.client.options.messages?.end),
            doNotSend: false,
        });
        return giveaway;
    }
    async reroll(ctx, id) {
        const giveaway = this.giveaways.get(id);
        if (!giveaway)
            return null;
        const eligibleEntries = giveaway.entries.filter(e => !giveaway.winners.includes(e));
        const newWinners = this.pickWinners(eligibleEntries, giveaway.winnersCount);
        giveaway.winners = newWinners;
        await forgescript_1.Interpreter.run({
            ...ctx.runtime,
            data: forgescript_1.Compiler.compile(this.client.options.messages?.reroll),
            doNotSend: false,
        });
        return giveaway;
    }
    addEntry(id, userID) {
        const giveaway = this.giveaways.get(id);
        if (!giveaway || giveaway.entries.includes(userID))
            return false;
        giveaway.entries.push(userID);
        return true;
    }
    removeEntry(id, userID) {
        const giveaway = this.giveaways.get(id);
        if (!giveaway)
            return false;
        const index = giveaway.entries.indexOf(userID);
        if (index === -1)
            return false;
        giveaway.entries.splice(index, 1);
        return true;
    }
    pickWinners(entries, amount) {
        const shuffled = entries.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
}
exports.GiveawaysManager = GiveawaysManager;
//# sourceMappingURL=GiveawaysManager.js.map