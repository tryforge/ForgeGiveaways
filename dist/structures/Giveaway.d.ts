import { APIInteractionGuildMember, GuildMember, Snowflake } from "discord.js";
import { IGiveawayStartOptions } from "../managers";
export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake;
    timestamp: number;
    hasEnded: boolean;
    messageID?: Snowflake;
    entries: Snowflake[];
    winners: Snowflake[];
    previousWinners?: Snowflake[];
}
export declare class Giveaway implements IGiveaway {
    /**
     * The id of this giveaway.
     */
    id: Snowflake;
    /**
     * The prize of this giveaway.
     */
    prize: string;
    /**
     * The duration of this giveaway in ms.
     */
    duration: number;
    /**
     * The timestamp this giveaway has been created at.
     */
    timestamp: number;
    /**
     * The max amount of winners for this giveaway.
     */
    winnersCount: number;
    /**
     * Indicates whether this giveaway has ended.
     */
    hasEnded: boolean;
    /**
     * The id of the host for this giveaway.
     */
    hostID: Snowflake;
    /**
     * The id of the guild this giveaway has been created on.
     */
    guildID: Snowflake;
    /**
     * The id of the channel this giveaway has been created in.
     */
    channelID: Snowflake;
    /**
     * The id of the message this giveaway is associated with.
     */
    messageID?: Snowflake;
    /**
     * The user entries for this giveaway.
     */
    entries: Snowflake[];
    /**
     * The randomly selected winners of this giveaway.
     */
    winners: Snowflake[];
    /**
     * The previous winners of this giveaway.
     */
    previousWinners?: Snowflake[];
    /**
     * The requirements all participants have to meet for entering this giveaway.
     */
    requirements?: IGiveawayStartOptions["requirements"];
    constructor(options?: Partial<IGiveawayStartOptions> & {
        id?: Snowflake;
    });
    /**
     * Returns the end timestamp of this giveaway.
     * @returns
     */
    endTimestamp(): number;
    /**
     * Returns the time left for this giveaway.
     * @returns
     */
    timeLeft(): number;
    /**
     * Returns whether a user has entered this giveaway.
     * @param userID The user to check for.
     * @returns
     */
    hasEntered(userID: Snowflake): boolean;
    /**
     * Adds a user entry to this giveaway.
     * @param userID The user to add as participant.
     * @returns
     */
    addEntry(userID: Snowflake): this | null;
    /**
     * Removes a user entry from this giveaway.
     * @param userID The user to remove as participant.
     * @returns
     */
    removeEntry(userID: Snowflake): this | null;
    /**
     * Returns whether a member is eligible to enter this giveaway.
     * @param member The guild member to check for requirements.
     * @returns
     */
    canEnter(member: GuildMember | APIInteractionGuildMember): boolean;
    /**
     * Clones this giveaway.
     * @returns
     */
    clone(): this;
}
export declare class MongoGiveaway extends Giveaway {
    /**
     * The object id for MongoDB.
     */
    mongoId?: string;
}
//# sourceMappingURL=Giveaway.d.ts.map