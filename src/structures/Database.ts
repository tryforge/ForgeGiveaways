import { GiveawaysDatabaseManager } from "../managers"
import { IGiveawayEvents } from "../handlers"
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Snowflake } from "discord.js"
import { DataSource } from "typeorm"
import { Giveaway, MongoGiveaway } from "./Giveaway"

export type AnyGiveaway = typeof Giveaway | typeof MongoGiveaway

export class Database extends GiveawaysDatabaseManager {
    public database = "giveaways.db"

    public entityManager = {
        sqlite: [Giveaway],
        mongodb: [MongoGiveaway],
        mysql: [Giveaway],
        postgres: [Giveaway],
    }

    public static entities: {
        Giveaway: AnyGiveaway
    }

    private db: Promise<DataSource>
    private static db: DataSource
    private static emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>

    constructor(private readonly emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>) {
        super()
        this.type ??= "sqlite"
        this.db = this.getDB()
        Database.entities = {
            Giveaway: this.entityManager[this.type === "better-sqlite3" ? "sqlite" : this.type][0],
        }
    }

    public async init() {
        Database.emitter = this.emitter
        Database.db = await this.db
        Database.emitter.emit("databaseConnect")
    }

    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns 
     */
    public static async get(id: Snowflake) {
        return await this.db.getRepository(this.entities.Giveaway).findOneBy({ id })
    }

    /**
     * Gets all existing giveaways.
     * @returns 
     */
    public static async getAll() {
        return await this.db.getRepository(this.entities.Giveaway).find()
    }

    /**
     * Saves a giveaway in the database.
     * @param data The giveaway data to save.
     */
    public static async set(data: Giveaway | MongoGiveaway) {
        const oldData = await this.db.getRepository(this.entities.Giveaway).findOneBy({ id: data.id })

        if (oldData && this.type === "mongodb") {
            await this.db.getRepository(this.entities.Giveaway).update(oldData.id, data)
        } else {
            await this.db.getRepository(this.entities.Giveaway).save(data)
        }
    }

    /**
     * Deletes an existing giveaway from the database.
     * @param id The id of the giveaway to delete.
     * @returns 
     */
    public static async delete(id: Snowflake) {
        return await this.db.getRepository(this.entities.Giveaway).delete({ id })
    }

    /**
     * Wipes the entire database.
     * @returns 
     */
    public static async wipe() {
        return await this.db.getRepository(this.entities.Giveaway).clear()
    }
}