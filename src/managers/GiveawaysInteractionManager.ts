import { ForgeClient } from "@tryforge/forgescript"
import { GuildMember, MessageFlags } from "discord.js"
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

            const oldGiveaway = giveaway.clone()
            const entered = giveaway.hasEntered(member.id)

            if (entered) {
                giveaway.removeEntry(member.id)
                client.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway)
            } else {
                giveaway.addEntry(member.id)
                client.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway)
            }

            interaction.reply({
                content: `You have successfully ${entered ? "left" : "entered"} the giveaway.`,
                flags: MessageFlags.Ephemeral,
            })
        })
    }
}
