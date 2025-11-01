"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const managers_1 = require("../managers");
const Giveaway_1 = require("./Giveaway");
class Database extends managers_1.GiveawaysDatabaseManager {
    emitter;
    database = "giveaways.db";
    entityManager = {
        sqlite: [Giveaway_1.Giveaway],
        mongodb: [Giveaway_1.MongoGiveaway],
        mysql: [Giveaway_1.Giveaway],
        postgres: [Giveaway_1.Giveaway],
    };
    static entities;
    db;
    static db;
    static emitter;
    constructor(emitter) {
        super();
        this.emitter = emitter;
        this.type ??= "sqlite";
        this.db = this.getDB();
        Database.entities = {
            Giveaway: this.entityManager[this.type === "better-sqlite3" ? "sqlite" : this.type][0],
        };
    }
    async init() {
        Database.emitter = this.emitter;
        Database.db = await this.db;
        Database.emitter.emit("databaseConnect");
    }
    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns
     */
    static async get(id) {
        return await this.db.getRepository(this.entities.Giveaway).findOneBy({ id });
    }
    /**
     * Gets all existing giveaways.
     * @returns
     */
    static async getAll() {
        return await this.db.getRepository(this.entities.Giveaway).find();
    }
    /**
     * Finds existing giveaways matching the provided data.
     * @param data The data to use for searching.
     * @param amount The amount of results to return.
     * @returns
     */
    static async find(data, amount) {
        return await this.db.getRepository(this.entities.Giveaway).find({ where: data, take: amount });
    }
    /**
     * Saves a giveaway in the database.
     * @param data The giveaway data to save.
     */
    static async set(data) {
        const oldData = await this.get(data.id);
        if (oldData && this.type === "mongodb") {
            await this.db.getRepository(this.entities.Giveaway).update(oldData.id, data);
        }
        else {
            await this.db.getRepository(this.entities.Giveaway).save(data);
        }
    }
    /**
     * Deletes an existing giveaway from the database.
     * @param id The id of the giveaway to delete.
     * @returns
     */
    static async delete(id) {
        return await this.db.getRepository(this.entities.Giveaway).delete({ id });
    }
    /**
     * Wipes the entire database.
     * @returns
     */
    static async wipe() {
        return await this.db.getRepository(this.entities.Giveaway).clear();
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map