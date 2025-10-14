import { Context } from "@tryforge/forgescript";
import { Snowflake } from "discord.js";
import { ForgeGiveaways } from "..";
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
    messageID: Snowflake;
    entries: Snowflake[];
    winners: Snowflake[];
}
export declare class GiveawaysManager {
    private readonly client;
    private readonly giveaways;
    constructor(client: ForgeGiveaways);
    start(ctx: Context, options: IGiveawayStartOptions): Promise<IGiveaway>;
    end(ctx: Context, id: Snowflake): Promise<IGiveaway | null>;
    reroll(ctx: Context, id: Snowflake): Promise<IGiveaway | null>;
    addEntry(id: Snowflake, userID: Snowflake): boolean;
    removeEntry(id: Snowflake, userID: Snowflake): boolean;
    private pickWinners;
}
//# sourceMappingURL=GiveawaysManager.d.ts.map