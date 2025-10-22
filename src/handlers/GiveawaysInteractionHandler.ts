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

            const [action, id] = interaction.customId.split("-")
            if (action !== "giveawayEntry") return

            const client = this.client.getExtension(ForgeGiveaways, true)
            const giveaway = await Database.get(id)

            if (!giveaway) {
                throwGiveawaysError(GiveawaysErrorType.UnknownGiveaway, id)
                return
            }

            if (giveaway.hasEnded) {
                throwGiveawaysError(GiveawaysErrorType.GiveawayNotActive, id)
                return
            }

            const member = interaction.member

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
