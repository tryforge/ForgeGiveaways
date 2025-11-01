import { Snowflake } from "discord.js";
import { ForgeClient } from "@tryforge/forgescript";
import { IGiveawayRequirements } from "../structures";
export interface IGiveawayStartOptions {
    prize: string;
    duration: number;
    winnersCount: number;
    hostID: Snowflake;
    guildID: Snowflake;
    channelID: Snowflake;
    requirements?: IGiveawayRequirements;
}
export type IGiveawayEditOptions = Omit<IGiveawayStartOptions, "guildID" | "channelID">;
export declare class GiveawaysManager {
    private readonly client;
    private readonly giveaways;
    constructor(client: ForgeClient);
    /**
     * Starts a new giveaway on a guild.
     * @param options The start options for the giveaway.
     * @returns
     */
    start(options: IGiveawayStartOptions): Promise<import("..").Giveaway | undefined>;
    /**
     * Ends an existing giveaway.
     * @param id The id of the giveaway to end.
     * @returns
     */
    end(id: Snowflake): Promise<import("..").Giveaway | undefined>;
    /**
     * Rerolls an existing giveaway.
     * @param id The id of the giveaway to reroll.
     * @param unique Whether to not include the previous winners.
     * @param amount The amount of new winners.
     * @returns
     */
    reroll(id: Snowflake, unique?: boolean, amount?: number): Promise<import("..").Giveaway | undefined>;
    /**
     * Edits an existing giveaway.
     * @param id The id of the giveaway to edit.
     * @param options The options used to edit this giveaway.
     */
    edit(id: Snowflake, options: IGiveawayEditOptions): Promise<import("..").Giveaway | null>;
    /**
     * Fetches the message of a giveaway.
     * @param channelID The id of the channel to pull message from.
     * @param messageID The id of the message to fetch.
     * @returns
     */
    fetchMessage(channelID: Snowflake, messageID?: Snowflake): Promise<void | import("discord.js").Message<true>>;
    /**
     * Randomly picks X amount of winners from the provided entries.
     * @param entries The entries to pick winners from.
     * @param amount The amount of winners to pick.
     * @returns
     */
    private _pickWinners;
    /**
     * Parses the mentions for all giveaway winners.
     * @param winners The winners to parse mentions for.
     * @returns
     */
    private _parseMentions;
    /**
     * Restores all active giveaways on startup.
     * @returns
     */
    private _restoreGiveaways;
}
//# sourceMappingURL=GiveawaysManager.d.ts.map