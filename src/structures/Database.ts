import { GiveawaysDatabaseManager, IGiveawayEvents } from "../managers"
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Snowflake } from "discord.js"
import { DataSource, Repository } from "typeorm"
import { Giveaway } from "./Giveaway"

export class Database extends GiveawaysDatabaseManager {
    public database = "giveaway.db"

    public entityManager = {
        sqlite: [Giveaway],
        mongodb: [Giveaway],
        mysql: [Giveaway],
        postgres: [Giveaway],
    }

    private static entity: {
        Giveaway: typeof Giveaway
    }

    private db?: DataSource
    private repo?: Repository<Giveaway>

    constructor(private readonly emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>) {
        super()
        Database.entity = {
            Giveaway: this.entityManager[this.type === "better-sqlite3" ? "sqlite" : this.type!][0],
        }
    }

    public async init() {
        this.db = await this.getDB()
        this.repo = this.db.getRepository(Giveaway)
        this.emitter.emit("databaseConnect")
    }

    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns 
     */
    public async get(id: Snowflake) {
        return await this.repo?.findOneBy({ id })
    }

    /**
     * Gets all existing giveaways.
     * @returns 
     */
    public async getAll() {
        return await this.repo?.find()
    }

    /**
     * Saves a giveaway in the database.
     * @param data The giveaway data to save.
     */
    public async set(data: Giveaway) {
        const oldData = await this.repo?.findOneBy({ id: data.id })

        if (oldData && this.type === "mongodb") {
            await this.repo?.update(oldData.id, data)
        } else {
            await this.repo?.save(data)
        }
    }

    /**
     * Deletes an existing giveaway from the database.
     * @param data The id of the giveaway to delete.
     * @returns 
     */
    public async delete(id: Snowflake) {
        return await this.repo?.delete({ id })
    }

    /**
     * Wipes the entire database.
     * @returns 
     */
    public async wipe() {
        return await this.repo?.clear()
    }
}