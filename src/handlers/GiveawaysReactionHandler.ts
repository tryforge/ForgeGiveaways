import { ForgeClient } from "@tryforge/forgescript"
import { Database } from "../structures"
import { Snowflake } from "discord.js"
import { ForgeGiveaways, IGiveawayEvents } from ".."
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import noop from "../functions/noop"

export class GiveawaysReactionHandler {
    private readonly emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>

    public constructor(private readonly client: ForgeClient) {
        this.emitter = client.getExtension(ForgeGiveaways, true).emitter
        this._register()
    }

    private async _register() {
        // Add Entry
        this.client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) return

            const { message, users, emoji } = reaction
            if (emoji.name !== "🎉") return

            const giveaway = await this._find(message.channelId, message.id)
            if (!giveaway || giveaway.hasEnded) return

            const member = this.client.guilds.cache.get(giveaway.guildID)?.members.cache.get(user.id)

            if (!member || !giveaway.canEnter(member)) {
                users.remove(user.id).catch(noop)
                this.emitter.emit("giveawayEntryRevoke", giveaway, reaction)
                return
            }

            const oldGiveaway = giveaway.clone()

            giveaway.addEntry(user.id)
            await Database.set(giveaway).catch(noop)
            this.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway, reaction)
        })

        // Remove Entry
        this.client.on("messageReactionRemove", async (reaction, user) => {
            if (user.bot) return

            const { message, emoji } = reaction
            if (emoji.name !== "🎉") return

            const giveaway = await this._find(message.channelId, message.id)
            if (!giveaway || giveaway.hasEnded) return

            const oldGiveaway = giveaway.clone()

            giveaway.removeEntry(user.id)
            await Database.set(giveaway).catch(noop)
            this.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway, reaction)
        })
    }

    /**
     * Finds an existing giveaway.
     * @param channelID The id of the channel the message is located at.
     * @param messageID The id of the message to get the giveaway from.
     * @returns 
     */
    private async _find(channelID: Snowflake, messageID: Snowflake) {
        return await Database.find({ channelID, messageID }, 1).then((x) => x[0])
    }
}