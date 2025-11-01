import { GiveawaysDatabaseManager } from "../managers";
import { IGiveawayEvents } from "../handlers";
import { TypedEmitter } from "tiny-typed-emitter";
import { TransformEvents } from "@tryforge/forge.db";
import { Snowflake } from "discord.js";
import { Giveaway, IGiveaway, MongoGiveaway } from "./Giveaway";
export type AnyGiveaway = typeof Giveaway | typeof MongoGiveaway;
export type IGiveawayFindOptions = Omit<IGiveaway, "entries" | "winners" | "previousWinners">;
export declare class Database extends GiveawaysDatabaseManager {
    private readonly emitter;
    database: string;
    entityManager: {
        sqlite: (typeof Giveaway)[];
        mongodb: (typeof MongoGiveaway)[];
        mysql: (typeof Giveaway)[];
        postgres: (typeof Giveaway)[];
    };
    static entities: {
        Giveaway: AnyGiveaway;
    };
    private db;
    private static db;
    private static emitter;
    constructor(emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>);
    init(): Promise<void>;
    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns
     */
    static get(id: Snowflake): Promise<Giveaway | null>;
    /**
     * Gets all existing giveaways.
     * @returns
     */
    static getAll(): Promise<Giveaway[]>;
    /**
     * Finds existing giveaways matching the provided data.
     * @param data The data to use for searching.
     * @param amount The amount of results to return.
     * @returns
     */
    static find(data?: Partial<IGiveawayFindOptions>, amount?: number): Promise<Giveaway[]>;
    /**
     * Saves a giveaway in the database.
     * @param data The giveaway data to save.
     */
    static set(data: Giveaway | MongoGiveaway): Promise<void>;
    /**
     * Deletes an existing giveaway from the database.
     * @param id The id of the giveaway to delete.
     * @returns
     */
    static delete(id: Snowflake): Promise<import("typeorm").DeleteResult>;
    /**
     * Wipes the entire database.
     * @returns
     */
    static wipe(): Promise<void>;
}
//# sourceMappingURL=Database.d.ts.map