import { Snowflake } from "discord.js";
import { ForgeClient } from "@tryforge/forgescript";
import { IGiveawayRequirements } from "../structures";
import { ForgeGiveaways } from "..";
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
    private readonly giveaways;
    private readonly client;
    constructor(giveaways: ForgeGiveaways, client: ForgeClient);
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
    end(id: Snowflake): Promise<import("..").Giveaway | null>;
    /**
     * Rerolls an existing giveaway.
     * @param id The id of the giveaway to reroll.
     * @returns
     */
    reroll(id: Snowflake): Promise<import("..").Giveaway | null>;
    /**
     * Edits an existing giveaway.
     * @param id The id of the giveaway to edit.
     * @param options The options used to edit this giveaway.
     */
    edit(id: Snowflake, options: IGiveawayEditOptions): Promise<import("..").Giveaway | null>;
    /**
     * Randomly picks X amount of winners from the provided entries.
     * @param entries The entries to pick winners from.
     * @param amount The amount of winners to pick.
     * @returns
     */
    private _pickWinners;
    /**
     * Restores all active giveaways on startup.
     * @returns
     */
    private _restoreGiveaways;
}
//# sourceMappingURL=GiveawaysManager.d.ts.map