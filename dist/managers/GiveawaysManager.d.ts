import { Context } from "@tryforge/forgescript";
import { Snowflake } from "discord.js";
import { ForgeGiveaways, IGiveawayEvents } from "..";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
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
export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake;
    messageID?: Snowflake;
    entries: Snowflake[];
    winners: Snowflake[];
}
export declare class GiveawaysManager {
    private readonly client;
    private emitter;
    private readonly giveaways;
    constructor(client: ForgeGiveaways, emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>);
    /**
     *
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns
     */
    start(ctx: Context, options: IGiveawayStartOptions): Promise<IGiveaway>;
    /**
     *
     * @param ctx The current context.
     * @param id The id of the giveaway to end.
     * @returns
     */
    end(ctx: Context, id: Snowflake): Promise<IGiveaway | null>;
    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns
     */
    reroll(ctx: Context, id: Snowflake): Promise<IGiveaway | null>;
    addEntry(id: Snowflake, userID: Snowflake): boolean;
    removeEntry(id: Snowflake, userID: Snowflake): boolean;
    private pickWinners;
}
//# sourceMappingURL=GiveawaysManager.d.ts.map