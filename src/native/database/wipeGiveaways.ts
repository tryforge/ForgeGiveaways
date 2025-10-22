import { NativeFunction } from "@tryforge/forgescript"
import { Database } from "../.."

export default new NativeFunction({
    name: "$wipeGiveaways",
    version: "1.0.0",
    description: "Wipes all existing giveaways from the database permanently, use with caution",
    unwrap: false,
    async execute(ctx) {
        await Database.wipe()
        return this.success()
    }
})