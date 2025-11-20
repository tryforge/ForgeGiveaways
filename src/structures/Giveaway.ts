import { APIInteractionGuildMember, GuildMember, Snowflake, SnowflakeUtil } from "discord.js"
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from "typeorm"
import { IGiveawayStartOptions } from "../managers"

export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake
    timestamp: number
    hasEnded: boolean
    messageID?: Snowflake
    entries: Snowflake[]
    winners: Snowflake[]
    previousWinners?: Snowflake[]
}

@Entity()
export class Giveaway implements IGiveaway {
    /**
     * The id of this giveaway.
     */
    @PrimaryColumn()
    public id: Snowflake

    /**
     * The prize of this giveaway.
     */
    @Column()
    public prize: string

    /**
     * The duration of this giveaway in ms.
     */
    @Column()
    public duration: number

    /**
     * The timestamp this giveaway has been created at.
     */
    @Column()
    public timestamp: number

    /**
     * The max amount of winners for this giveaway.
     */
    @Column()
    public winnersCount: number

    /**
     * Indicates whether this giveaway has ended.
     */
    @Column()
    public hasEnded: boolean

    /**
     * The id of the host for this giveaway.
     */
    @Column()
    public hostID: Snowflake

    /**
     * The id of the guild this giveaway has been created on.
     */
    @Column()
    public guildID: Snowflake

    /**
     * The id of the channel this giveaway has been created in.
     */
    @Column()
    public channelID: Snowflake

    /**
     * The id of the message this giveaway is associated with.
     */
    @Column({ nullable: true })
    public messageID?: Snowflake

    /**
     * The user entries for this giveaway.
     */
    @Column("simple-array")
    public entries: Snowflake[]

    /**
     * The randomly selected winners of this giveaway.
     */
    @Column("simple-array")
    public winners: Snowflake[]

    /**
     * The previous winners of this giveaway.
     */
    @Column("simple-array", { nullable: true })
    public previousWinners?: Snowflake[]

    /**
     * The requirements all participants have to meet for entering this giveaway.
     */
    @Column("simple-json", { nullable: true })
    public requirements?: IGiveawayStartOptions["requirements"]

    constructor(options?: Partial<IGiveawayStartOptions> & { id?: Snowflake }) {
        this.id = options?.id ?? SnowflakeUtil.generate().toString()
        this.prize = options?.prize ?? ""
        this.duration = options?.duration ?? 0
        this.winnersCount = options?.winnersCount ?? 1
        this.hostID = options?.hostID ?? ""
        this.guildID = options?.guildID ?? ""
        this.channelID = options?.channelID ?? ""
        this.requirements = options?.requirements
        this.timestamp = SnowflakeUtil.timestampFrom(this.id)
        this.hasEnded = false
        this.entries = []
        this.winners = []
    }

    /**
     * Returns the end timestamp of this giveaway.
     * @returns
     */
    public endTimestamp() {
        return this.timestamp + this.duration
    }

    /**
     * Returns the time left for this giveaway.
     * @returns 
     */
    public timeLeft() {
        return Math.max(this.endTimestamp() - Date.now(), 0)
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
    public canEnter(member: GuildMember | APIInteractionGuildMember) {
        const req = this.requirements
        if (!req) return true

        const roles = member instanceof GuildMember ? member.roles.cache.map((x) => x.id) : member.roles
        const hasRequiredRoles = req.requiredRoles?.every((r) => roles.includes(r)) ?? true
        const noRestrictedRoles = req.restrictedRoles?.every((r) => !roles.includes(r)) ?? true
        const notRestrictedMember = !req.restrictedMembers?.includes(member.user.id)

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

@Entity()
export class MongoGiveaway extends Giveaway {
    /**
     * The object id for MongoDB.
     */
    @ObjectIdColumn()
    public mongoId?: string
}