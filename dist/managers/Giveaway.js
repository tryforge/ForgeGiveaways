"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaway = void 0;
const discord_js_1 = require("discord.js");
class Giveaway {
    id;
    prize;
    duration;
    winnersCount;
    hostID;
    guildID;
    channelID;
    entries;
    winners;
    requirements;
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
     * Returns whether the giveaway has ended.
     * @returns
     */
    hasEnded() {
        return (Date.now() > discord_js_1.SnowflakeUtil.timestampFrom(this.id) + this.duration);
    }
    /**
     * Adds a user entry to the giveaway.
     * @param userID The user to add as participant.
     */
    addEntry(userID) {
        if (!this.entries.includes(userID))
            this.entries.push(userID);
    }
    /**
     * Removes a user entry from the giveaway.
     * @param userID The user to remove as participant.
     */
    removeEntry(userID) {
        this.entries = this.entries.filter((e) => e !== userID);
    }
}
exports.Giveaway = Giveaway;
//# sourceMappingURL=Giveaway.js.map