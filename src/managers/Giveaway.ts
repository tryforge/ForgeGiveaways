import { Snowflake, SnowflakeUtil } from "discord.js"
import { IGiveawayStartOptions } from "./GiveawaysManager"

export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake
    messageID?: Snowflake
    entries: Snowflake[]
    winners: Snowflake[]
}

export class Giveaway implements IGiveaway {
    public id: Snowflake
    public prize: string
    public duration: number
    public winnersCount: number
    public hostID: Snowflake
    public guildID: Snowflake
    public channelID: Snowflake
    public entries: Snowflake[]
    public winners: Snowflake[]
    public requirements?: IGiveawayStartOptions["requirements"]
    public messageID?: Snowflake

    constructor(options: IGiveawayStartOptions & { id?: Snowflake }) {
        this.id = options.id ?? SnowflakeUtil.generate().toString()
        this.prize = options.prize
        this.duration = options.duration
        this.winnersCount = options.winnersCount
        this.hostID = options.hostID
        this.guildID = options.guildID
        this.channelID = options.channelID
        this.requirements = options.requirements
        this.entries = []
        this.winners = []
    }

    /**
     * Returns whether the giveaway has ended.
     * @returns 
     */
    public hasEnded() {
        return (Date.now() > SnowflakeUtil.timestampFrom(this.id) + this.duration)
    }

    /**
     * Adds a user entry to the giveaway.
     * @param userID The user to add as participant.
     */
    public addEntry(userID: Snowflake) {
        if (!this.entries.includes(userID)) this.entries.push(userID)
    }

    /**
     * Removes a user entry from the giveaway.
     * @param userID The user to remove as participant.
     */
    public removeEntry(userID: Snowflake) {
        this.entries = this.entries.filter((e) => e !== userID)
    }
}