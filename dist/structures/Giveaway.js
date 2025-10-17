"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaway = void 0;
const discord_js_1 = require("discord.js");
class Giveaway {
    /**
     * The id of this giveaway.
     */
    id;
    /**
     * The prize of this giveaway.
     */
    prize;
    /**
     * The duration of the giveaway in ms.
     */
    duration;
    /**
     * The max amount of winners for this giveaway.
     */
    winnersCount;
    /**
     * The id of the host for this giveaway.
     */
    hostID;
    /**
     * The id of the guild this giveaway has been created on.
     */
    guildID;
    /**
     * The id of the channel this giveaway has been created in.
     */
    channelID;
    /**
     * The user entries for this giveaway.
     */
    entries;
    /**
     * The randomly selected winners of this giveaway.
     */
    winners;
    /**
     * The requirements all participants have to meet for entering this giveaway.
     */
    requirements;
    /**
     * The id of the message this giveaway is associated with.
     */
    messageID;
    constructor(options) {
        this.id = options.id ?? discord_js_1.SnowflakeUtil.generate().toString();
        this.prize = options.prize;
        this.duration = options.duration;
        this.winnersCount = options.winnersCount;
        this.hostID = options.hostID;
        this.guildID = options.guildID;
        this.channelID = options.channelID;
        this.requirements = options.requirements;
        this.entries = [];
        this.winners = [];
    }
    /**
     * Returns whether this giveaway has ended.
     * @returns
     */
    hasEnded() {
        return (Date.now() > discord_js_1.SnowflakeUtil.timestampFrom(this.id) + this.duration);
    }
    /**
     * Returns whether a user has entered this giveaway.
     * @param userID The user to check for.
     * @returns
     */
    hasEntered(userID) {
        return this.entries.includes(userID);
    }
    /**
     * Adds a user entry to this giveaway.
     * @param userID The user to add as participant.
     * @returns
     */
    addEntry(userID) {
        if (this.hasEntered(userID))
            return null;
        this.entries.push(userID);
        return this;
    }
    /**
     * Removes a user entry from this giveaway.
     * @param userID The user to remove as participant.
     * @returns
     */
    removeEntry(userID) {
        if (!this.hasEntered(userID))
            return null;
        this.entries = this.entries.filter((e) => e !== userID);
        return this;
    }
    /**
     * Returns whether a member is eligible to enter this giveaway.
     * @param member The guild member to check for requirements.
     * @returns
     */
    canEnter(member) {
        const req = this.requirements;
        if (!req)
            return true;
        const hasRequiredRoles = req.requiredRoles?.every(r => member.roles.cache.has(r)) ?? true;
        const noRestrictedRoles = req.restrictedRoles?.every(r => !member.roles.cache.has(r)) ?? true;
        const notRestrictedMember = !req.restrictedMembers?.includes(member.id);
        return hasRequiredRoles && noRestrictedRoles && notRestrictedMember;
    }
    /**
     * Clones this giveaway.
     * @returns
     */
    clone() {
        return structuredClone(this);
    }
}
exports.Giveaway = Giveaway;
//# sourceMappingURL=Giveaway.js.map