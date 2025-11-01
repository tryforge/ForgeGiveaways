import { ForgeClient } from "@tryforge/forgescript"
import { MessageFlags } from "discord.js"
import { ForgeGiveaways } from ".."
import { Database } from "../structures"
import { GiveawaysErrorType, throwGiveawaysError } from "../functions/error"
import noop from "../functions/noop"

export class GiveawaysInteractionHandler {
    public constructor(private readonly client: ForgeClient) {
        this._register()
    }

    private async _register() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton() || !interaction.inGuild()) return
            const { customId, channelId, message, member } = interaction

            const [action] = customId.split("-")
            if (action !== "giveawayEntry") return

            const client = this.client.getExtension(ForgeGiveaways, true)
            const giveaway = await Database.find({ channelID: channelId, messageID: message.id }, 1).then((x) => x[0])

            if (!giveaway) {
                throwGiveawaysError(GiveawaysErrorType.UnknownGiveaway, message.id)
                return
            }

            if (giveaway.hasEnded) {
                throwGiveawaysError(GiveawaysErrorType.GiveawayNotActive, giveaway.id)
                return
            }

            if (!giveaway.canEnter(member)) {
                client.emitter.emit("giveawayEntryRevoke", giveaway, interaction)
                if (client.options.useDefault) {
                    await interaction.reply({
                        content: `❌ You do not meet the requirements to enter this giveaway!`,
                        flags: MessageFlags.Ephemeral,
                    }).catch(noop)
                }
                return
            }

            const oldGiveaway = giveaway.clone()
            const entered = giveaway.hasEntered(member.user.id)

            if (entered) {
                giveaway.removeEntry(member.user.id)
                await Database.set(giveaway).catch(noop)
                client.emitter.emit("giveawayEntryRemove", oldGiveaway, giveaway, interaction)
            } else {
                giveaway.addEntry(member.user.id)
                await Database.set(giveaway).catch(noop)
                client.emitter.emit("giveawayEntryAdd", oldGiveaway, giveaway, interaction)
            }

            if (client.options.useDefault) {
                await interaction.reply({
                    content: `✅ You have successfully ${entered ? "left" : "joined"} this giveaway.`,
                    flags: MessageFlags.Ephemeral,
                }).catch(noop)
            }
        })
    }
}
