import { GiveawaysDatabaseManager, IGiveawayEvents } from "../managers";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
import { Snowflake } from "discord.js";
import { Giveaway } from "./Giveaway";
export declare class Database extends GiveawaysDatabaseManager {
    private readonly emitter;
    database: string;
    entityManager: {
        sqlite: (typeof Giveaway)[];
        mongodb: (typeof Giveaway)[];
        mysql: (typeof Giveaway)[];
        postgres: (typeof Giveaway)[];
    };
    private db?;
    private repo?;
    constructor(emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>);
    init(): Promise<void>;
    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns
     */
    get(id: Snowflake): Promise<Giveaway | null | undefined>;
    /**
     * Gets all existing giveaways.
     * @returns
     */
    getAll(): Promise<Giveaway[] | undefined>;
    /**
     * Saves a giveaway in the database.
     * @param data The giveaway data to save.
     */
    set(data: Giveaway): Promise<void>;
    /**
     * Deletes an existing giveaway from the database.
     * @param data The id of the giveaway to delete.
     * @returns
     */
    delete(id: Snowflake): Promise<import("typeorm").DeleteResult | undefined>;
    /**
     * Wipes the entire database.
     * @returns
     */
    wipe(): Promise<void | undefined>;
}
//# sourceMappingURL=Database.d.ts.map