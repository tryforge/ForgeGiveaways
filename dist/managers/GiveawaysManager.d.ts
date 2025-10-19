import { Snowflake } from "discord.js";
import { ForgeClient } from "@tryforge/forgescript";
import { TransformEvents } from "@tryforge/forge.db";
import { TypedEmitter } from "tiny-typed-emitter";
import { IGiveawayRequirements } from "../structures";
import { IGiveawayEvents } from "./GiveawaysEventManager";
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
    private emitter;
    constructor(giveaways: ForgeGiveaways, client: ForgeClient, emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>);
    /**
     * Starts a new giveaway on a guild.
     * @param options The start options for the giveaway.
     * @returns
     */
    start(options: IGiveawayStartOptions): Promise<import("../structures").Giveaway | undefined>;
    /**
     * Ends an existing giveaway.
     * @param id The id of the giveaway to end.
     * @returns
     */
    end(id: Snowflake): Promise<import("../structures").Giveaway | null>;
    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns
     */
    reroll(id: Snowflake): Promise<import("../structures").Giveaway | null>;
    /**
     * Edits an existing giveaway.
     * @param id The id of the giveaway to edit.
     * @param options The options used to edit this giveaway.
     */
    edit(id: Snowflake, options: IGiveawayEditOptions): Promise<import("../structures").Giveaway | null>;
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