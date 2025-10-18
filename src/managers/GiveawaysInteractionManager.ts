import { ForgeClient } from "@tryforge/forgescript"
import { GuildMember, MessageFlags } from "discord.js"
import { ForgeGiveaways } from ".."
import { Database } from "../structures"

export class GiveawaysInteractionManager {
    public constructor(private readonly client: ForgeClient) {
        this._register()
    }

    private async _register() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton() || !interaction.customId.startsWith("giveawayEntry-")) return
            const [, id] = interaction.customId.split("-")

            const client = this.client.getExtension(ForgeGiveaways, true)
            const giveaway = await Database.get(id)
            if (!giveaway) return

            const member = interaction.member
            if (!(member instanceof GuildMember && giveaway.canEnter(member))) return

            const oldGiveaway = giveaway.clone()
            const entered = giveaway.hasEntered(member.id)

            if (entered) {
                giveaway.removeEntry(member.id)
                await Database.set(giveaway)
                client.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway)
            } else {
                giveaway.addEntry(member.id)
                await Database.set(giveaway)
                client.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway)
            }

            interaction.reply({
                content: `You have successfully ${entered ? "left" : "entered"} the giveaway.`,
                flags: MessageFlags.Ephemeral,
            })
        })
    }
}
