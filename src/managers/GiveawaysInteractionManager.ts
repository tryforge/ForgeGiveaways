import { ForgeClient } from "@tryforge/forgescript"
import { GuildMember } from "discord.js"
import { ForgeGiveaways } from ".."

export class GiveawaysInteractionManager {
    public constructor(private readonly client: ForgeClient) {
        this._register()
    }

    private _register() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton() || !interaction.customId.startsWith("giveawayEntry-")) return
            const [, id] = interaction.customId.split("-")

            const client = this.client.getExtension(ForgeGiveaways, true)
            const giveaway = client.giveawaysManager.get(id)
            if (!giveaway) return

            const member = interaction.member
            if (!(member instanceof GuildMember && giveaway.canEnter(member))) return

            if (giveaway.hasEntered(member.id)) {
                const newGiveaway = giveaway.removeEntry(member.id)
                if (newGiveaway) client.emitter.emit("giveawayEntryRemove", newGiveaway, giveaway)
            } else {
                const newGiveaway = giveaway.addEntry(member.id)
                if (newGiveaway) client.emitter.emit("giveawayEntryAdd", newGiveaway, giveaway)
            }
        })
    }
}
