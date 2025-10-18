import { Snowflake } from "discord.js";
import { Context } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
import { Giveaway, IGiveawayRequirements } from "../structures";
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
export declare class GiveawaysManager {
    private readonly client;
    private emitter;
    constructor(client: ForgeGiveaways, emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>);
    /**
     * Starts a new giveaway on a guild.
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns
     */
    start(ctx: Context, options: IGiveawayStartOptions): Promise<Giveaway | undefined>;
    /**
     * Ends an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to end.
     * @returns
     */
    end(ctx: Context, id: Snowflake): Promise<Giveaway | null>;
    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns
     */
    reroll(ctx: Context, id: Snowflake): Promise<Giveaway | null>;
    private _pickWinners;
    private _restoreGiveaways;
}
//# sourceMappingURL=GiveawaysManager.d.ts.map