import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake, TextChannel, time } from "discord.js"
import { ForgeClient } from "@tryforge/forgescript"
import { TransformEvents } from "@tryforge/forge.db"
import { TypedEmitter } from "tiny-typed-emitter"
import { Database, IGiveawayRequirements } from "../structures"
import { GiveawaysErrorType, throwGiveawaysError } from "../functions/error"
import { IGiveawayEvents } from "./GiveawaysEventManager"
import { ForgeGiveaways } from ".."
import noop from "../functions/noop"

export interface IGiveawayStartOptions {
    prize: string
    duration: number
    winnersCount: number
    hostID: Snowflake
    guildID: Snowflake
    channelID: Snowflake
    requirements?: IGiveawayRequirements
}

export type IGiveawayEditOptions = Omit<IGiveawayStartOptions, "guildID" | "channelID">

export class GiveawaysManager {
    public constructor(
        private readonly giveaways: ForgeGiveaways,
        private readonly client: ForgeClient,
        private emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>
    ) {
        client.once("clientReady", () => this._restoreGiveaways())
    }

    /**
     * Starts a new giveaway on a guild.
     * @param options The start options for the giveaway.
     * @returns 
     */
    public async start(options: IGiveawayStartOptions) {
        const giveaway = new Database.entities.Giveaway(options)
        const chan = this.client.channels.cache.get(giveaway.channelID) as TextChannel | undefined

        if (this.giveaways.options.useDefault) {
            const embed = new EmbedBuilder()
                .setTitle("🎉 GIVEAWAY 🎉")
                .setDescription(`**Prize:** ${giveaway.prize}\n**Winners:** ${giveaway.winnersCount}`)
                .setFields(
                    { name: "Ends", value: `${time(new Date(Date.now() + giveaway.duration), "R")}`, inline: true },
                    { name: "Hosted by", value: `<@${giveaway.hostID}>`, inline: true },
                )
                .setColor("Green")

            const comps = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`giveawayEntry-${giveaway.id}`)
                        .setLabel("Entry")
                        .setStyle(ButtonStyle.Primary)
                )

            const msg = await chan?.send({
                embeds: [embed],
                components: [comps.toJSON()]
            }).catch(noop)

            if (!msg) {
                throwGiveawaysError(GiveawaysErrorType.MessageNotFound, giveaway.id)
                return
            }

            giveaway.messageID = msg.id
        }

        await Database.set(giveaway).catch(noop)
        this.emitter.emit("giveawayStart", giveaway)
        setTimeout(async () => await this.end(giveaway.id).catch(noop), giveaway.duration)

        return giveaway
    }

    /**
     * Ends an existing giveaway.
     * @param id The id of the giveaway to end.
     * @returns 
     */
    public async end(id: Snowflake) {
        const giveaway = await Database.get(id)
        if (!giveaway || giveaway.hasEnded) return null
        giveaway.hasEnded = true

        const guild = this.client.guilds.cache.get(giveaway.guildID)
        const eligibleEntries = giveaway.entries.filter((e) => {
            const member = guild?.members.cache.get(e)
            return member && giveaway.canEnter(member)
        })
        const winners = this._pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = winners

        if (this.giveaways.options.useDefault) {
            const chan = this.client.channels.cache.get(giveaway.channelID) as TextChannel | undefined
            const msg = giveaway.messageID ? await chan?.messages.fetch(giveaway.messageID).catch(noop) : undefined

            if (msg) {
                const oldEmbed = msg.embeds[0]
                const embed = EmbedBuilder.from(oldEmbed)
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .spliceFields(0, 1, { name: "Ended", value: oldEmbed.fields[0].value, inline: true })
                    .setColor("Red")

                msg.edit({
                    embeds: [embed],
                    components: []
                }).catch(noop)

                const plural = winners.length > 1 ? "s" : ""
                msg.reply({
                    content: winners.length === 0
                        ? "😢 No winners for this giveaway!"
                        : `🎉 Congratulations to the winner${plural} of **${giveaway.prize}**!\n> 🏆 **Winner${plural}:** ${winners.map((id) => `<@${id}>`).join(", ")}`,
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(noop)
            }
        }

        await Database.set(giveaway).catch(noop)
        this.emitter.emit("giveawayEnd", giveaway)

        return giveaway
    }

    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns 
     */
    public async reroll(id: Snowflake) {
        const giveaway = await Database.get(id)
        if (!giveaway || !giveaway.hasEnded) return null
        const oldGiveaway = giveaway.clone()

        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e))
        const newWinners = this._pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = newWinners

        if (this.giveaways.options.useDefault) {}

        await Database.set(giveaway).catch(noop)
        this.emitter.emit("giveawayReroll", oldGiveaway, giveaway)

        return giveaway
    }

    /**
     * Edits an existing giveaway.
     * @param id The id of the giveaway to edit.
     * @param options The options used to edit this giveaway.
     */
    public async edit(id: Snowflake, options: IGiveawayEditOptions) {
        const giveaway = await Database.get(id)
        if (!giveaway || giveaway.hasEnded) return null
        const oldGiveaway = giveaway.clone()

        if (options.prize) giveaway.prize = options.prize
        if (options.duration) giveaway.duration = options.duration
        if (options.winnersCount) giveaway.winnersCount = options.winnersCount
        if (options.hostID) giveaway.hostID = options.hostID
        if (options.requirements) giveaway.requirements = options.requirements

        if (this.giveaways.options.useDefault) {}

        await Database.set(giveaway).catch(noop)
        this.emitter.emit("giveawayEdit", oldGiveaway, giveaway)

        return giveaway
    }

    /**
     * Randomly picks X amount of winners from the provided entries.
     * @param entries The entries to pick winners from.
     * @param amount The amount of winners to pick.
     * @returns 
     */
    private _pickWinners(entries: Snowflake[], amount: number) {
        const shuffled = entries.sort(() => Math.random() - 0.5)
        return shuffled.slice(0, amount)
    }

    /**
     * Restores all active giveaways on startup.
     * @returns 
     */
    private async _restoreGiveaways() {
        const giveaways = await Database.getAll()
        if (!giveaways) return

        for (const giveaway of giveaways) {
            if (giveaway.hasEnded) continue

            if (giveaway.timeLeft() > 0) {
                setTimeout(async () => await this.end(giveaway.id).catch(noop), giveaway.timeLeft())
            } else {
                await this.end(giveaway.id).catch(noop)
            }
        }
    }
}