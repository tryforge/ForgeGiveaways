import { Context } from "@tryforge/forgescript";
import { Collection, Snowflake } from "discord.js";
import { ForgeGiveaways, IGiveawayEvents } from "..";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
import { Giveaway } from "../structures";
export interface IGiveawayStartOptions {
    prize: string;
    duration: number;
    winnersCount: number;
    hostID: Snowflake;
    guildID: Snowflake;
    channelID: Snowflake;
    requirements?: {
        requiredRoles?: Snowflake[];
        restrictedRoles?: Snowflake[];
        restrictedMembers?: Snowflake[];
    };
}
export declare class GiveawaysManager {
    private readonly client;
    private emitter;
    private readonly giveaways;
    constructor(client: ForgeGiveaways, emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>);
    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns
     */
    get(id: Snowflake): Giveaway | undefined;
    /**
     * Gets all existing giveaways.
     * @returns
     */
    getAll(): Collection<string, Giveaway>;
    /**
     * Starts a new giveaway on a guild.
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns
     */
    start(ctx: Context, options: IGiveawayStartOptions): Promise<Giveaway>;
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
    private pickWinners;
}
//# sourceMappingURL=GiveawaysManager.d.ts.map