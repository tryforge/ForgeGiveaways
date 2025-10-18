"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const managers_1 = require("../managers");
const Giveaway_1 = require("./Giveaway");
class Database extends managers_1.GiveawaysDatabaseManager {
    emitter;
    database = "giveaway.db";
    entityManager = {
        sqlite: [Giveaway_1.Giveaway],
        mongodb: [Giveaway_1.Giveaway],
        mysql: [Giveaway_1.Giveaway],
        postgres: [Giveaway_1.Giveaway],
    };
    db;
    repo;
    constructor(emitter) {
        super();
        this.emitter = emitter;
    }
    async init() {
        this.db = await this.getDB();
        this.repo = this.db.getRepository(Giveaway_1.Giveaway);
        this.emitter.emit("databaseConnect");
    }
    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns
     */
    async get(id) {
        return await this.repo?.findOneBy({ id });
    }
    /**
     * Gets all existing giveaways.
     * @returns
     */
    async getAll() {
        return await this.repo?.find();
    }
    /**
     * Saves a giveaway in the database.
     * @param data The giveaway data to save.
     */
    async set(data) {
        const oldData = await this.repo?.findOneBy({ id: data.id });
        if (oldData && this.type === "mongodb") {
            await this.repo?.update(oldData.id, data);
        }
        else {
            await this.repo?.save(data);
        }
    }
    /**
     * Deletes an existing giveaway from the database.
     * @param id The id of the giveaway to delete.
     * @returns
     */
    async delete(id) {
        return await this.repo?.delete({ id });
    }
    /**
     * Wipes the entire database.
     * @returns
     */
    async wipe() {
        return await this.repo?.clear();
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map