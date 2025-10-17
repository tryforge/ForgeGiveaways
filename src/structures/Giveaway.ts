import { GuildMember, Snowflake, SnowflakeUtil } from "discord.js"
import { IGiveawayStartOptions } from "../managers/GiveawaysManager"

export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake
    messageID?: Snowflake
    entries: Snowflake[]
    winners: Snowflake[]
}

export class Giveaway implements IGiveaway {
    /**
     * The id of this giveaway.
     */
    public id: Snowflake

    /**
     * The prize of this giveaway.
     */
    public prize: string

    /**
     * The duration of the giveaway in ms.
     */
    public duration: number

    /**
     * The max amount of winners for this giveaway.
     */
    public winnersCount: number

    /**
     * The id of the host for this giveaway.
     */
    public hostID: Snowflake

    /**
     * The id of the guild this giveaway has been created on.
     */
    public guildID: Snowflake

    /**
     * The id of the channel this giveaway has been created in.
     */
    public channelID: Snowflake

    /**
     * The user entries for this giveaway.
     */
    public entries: Snowflake[]

    /**
     * The randomly selected winners of this giveaway.
     */
    public winners: Snowflake[]

    /**
     * The requirements all participants have to meet for entering this giveaway.
     */
    public requirements?: IGiveawayStartOptions["requirements"]

    /**
     * The id of the message this giveaway is associated with.
     */
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
     * Returns whether this giveaway has ended.
     * @returns 
     */
    public hasEnded() {
        return (Date.now() > SnowflakeUtil.timestampFrom(this.id) + this.duration)
    }

    /**
     * Returns whether a user has entered this giveaway.
     * @param userID The user to check for.
     * @returns 
     */
    public hasEntered(userID: Snowflake) {
        return this.entries.includes(userID)
    }

    /**
     * Adds a user entry to this giveaway.
     * @param userID The user to add as participant.
     * @returns
     */
    public addEntry(userID: Snowflake) {
        if (this.hasEntered(userID)) return null
        this.entries.push(userID)
        return this
    }

    /**
     * Removes a user entry from this giveaway.
     * @param userID The user to remove as participant.
     * @returns
     */
    public removeEntry(userID: Snowflake) {
        if (!this.hasEntered(userID)) return null
        this.entries = this.entries.filter((e) => e !== userID)
        return this
    }

    /**
     * Returns whether a member is eligible to enter this giveaway. 
     * @param member The guild member to check for requirements.
     * @returns 
     */
    public canEnter(member: GuildMember) {
        const req = this.requirements
        if (!req) return true
        const hasRequiredRoles = req.requiredRoles?.every(r => member.roles.cache.has(r)) ?? true
        const noRestrictedRoles = req.restrictedRoles?.every(r => !member.roles.cache.has(r)) ?? true
        const notRestrictedMember = !req.restrictedMembers?.includes(member.id)
        return hasRequiredRoles && noRestrictedRoles && notRestrictedMember
    }

    /**
     * Clones this giveaway.
     * @returns
     */
    public clone() {
        return structuredClone(this)
    }
}