import { Snowflake } from "discord.js";
import { IGiveawayStartOptions } from "./GiveawaysManager";
export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake;
    messageID?: Snowflake;
    entries: Snowflake[];
    winners: Snowflake[];
}
export declare class Giveaway implements IGiveaway {
    id: Snowflake;
    prize: string;
    duration: number;
    winnersCount: number;
    hostID: Snowflake;
    guildID: Snowflake;
    channelID: Snowflake;
    entries: Snowflake[];
    winners: Snowflake[];
    requirements?: IGiveawayStartOptions["requirements"];
    messageID?: Snowflake;
    constructor(options: IGiveawayStartOptions & {
        id?: Snowflake;
    });
    /**
     * Returns whether the giveaway has ended.
     * @returns
     */
    hasEnded(): boolean;
    /**
     * Adds a user entry to the giveaway.
     * @param userID The user to add as participant.
     */
    addEntry(userID: Snowflake): void;
    /**
     * Removes a user entry from the giveaway.
     * @param userID The user to remove as participant.
     */
    removeEntry(userID: Snowflake): void;
}
//# sourceMappingURL=Giveaway.d.ts.map