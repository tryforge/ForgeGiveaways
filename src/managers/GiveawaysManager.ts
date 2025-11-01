import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake, TextChannel, time } from "discord.js"
import { ForgeClient } from "@tryforge/forgescript"
import { Database, IGiveawayRequirements } from "../structures"
import { GiveawaysErrorType, throwGiveawaysError } from "../functions/error"
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
    private readonly giveaways: ForgeGiveaways

    public constructor(private readonly client: ForgeClient) {
        this.giveaways = client.getExtension(ForgeGiveaways, true)
        client.once("clientReady", () => this._restoreGiveaways())
    }

    /**
     * Starts a new giveaway on a guild.
     * @param options The start options for the giveaway.
     * @returns 
     */
    public async start(options: IGiveawayStartOptions) {
        const giveaway = new Database.entities.Giveaway(options)
        const { useDefault, useReactions } = this.giveaways.options

        if (useDefault) {
            const chan = this.client.channels.cache.get(giveaway.channelID) as TextChannel | undefined
            const roles = giveaway.requirements?.requiredRoles?.map((id) => `<@&${id}>`).join(", ")
            let comps

            const embed = new EmbedBuilder()
                .setTitle("🎉 GIVEAWAY 🎉")
                .setDescription(`🎁 **Prize:** ${giveaway.prize}\n🏆 **Winners:** ${giveaway.winnersCount}${roles ? `\n\n📌 **Required Roles:** ${roles}` : ""}`)
                .setFields(
                    { name: "Ends", value: `${time(new Date(Date.now() + giveaway.timeLeft()), "R")}`, inline: true },
                    { name: "Hosted by", value: `<@${giveaway.hostID}>`, inline: true },
                )
                .setFooter({ text: `Click the ${useReactions ? "reaction" : "button"} below to join!` })
                .setTimestamp()
                .setColor("Green")

            if (!useReactions) {
                comps = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`giveawayEntry-${giveaway.id}`)
                            .setLabel("Join")
                            .setEmoji("🎉")
                            .setStyle(ButtonStyle.Success)
                    )
            }

            const msg = await chan?.send({
                embeds: [embed],
                components: comps ? [comps.toJSON()] : []
            }).catch(noop)

            if (!msg) {
                throwGiveawaysError(GiveawaysErrorType.MessageNotDetermined, giveaway.id)
                return
            }

            if (useReactions) msg.react("🎉").catch(noop)

            giveaway.messageID = msg.id
        }

        await Database.set(giveaway).catch(noop)
        this.giveaways.emitter.emit("giveawayStart", giveaway)
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
        if (!giveaway || giveaway.hasEnded) return
        giveaway.hasEnded = true

        const guild = this.client.guilds.cache.get(giveaway.guildID)
        const eligibleEntries = giveaway.entries.filter((e) => {
            const member = guild?.members.cache.get(e)
            return member && giveaway.canEnter(member)
        })
        const winners = this._pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = winners

        if (this.giveaways.options.useDefault) {
            const msg = await this.fetchMessage(giveaway.channelID, giveaway.messageID)

            if (msg) {
                const plural = winners.length === 1 ? "" : "s"
                const mentions = this._parseMentions(winners)

                const embed = new EmbedBuilder()
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .setDescription(`🎁 **Prize:** ${giveaway.prize}\n🏆 **Winner${plural}:** ${mentions || "None"}\n👥 **Total Entries:** ${giveaway.entries.length}`)
                    .addFields(
                        { name: "Ended", value: `${time(new Date(), "R")}`, inline: true },
                        { name: "Hosted by", value: `<@${giveaway.hostID}>`, inline: true },
                    )
                    .setFooter({ text: "Thanks for participating!" })
                    .setTimestamp(giveaway.timestamp)
                    .setColor("Red")

                msg.edit({
                    embeds: [embed],
                    components: []
                }).catch(noop)

                msg.reply({
                    content: winners.length
                        ? `🎉 Congratulations to the winner${plural} of **${giveaway.prize}**!\n🏆 **Winner${plural}:** ${mentions}`
                        : "😢 No winners for this giveaway!",
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(noop)
            } else {
                throwGiveawaysError(GiveawaysErrorType.MessageNotFound, giveaway.id)
                return
            }
        }

        await Database.set(giveaway).catch(noop)
        this.giveaways.emitter.emit("giveawayEnd", giveaway)

        return giveaway
    }

    /**
     * Rerolls an existing giveaway.
     * @param id The id of the giveaway to reroll.
     * @param unique Whether to not include the previous winners.
     * @param amount The amount of new winners.
     * @returns 
     */
    public async reroll(id: Snowflake, unique: boolean = false, amount?: number) {
        const giveaway = await Database.get(id)
        if (!giveaway || !giveaway.hasEnded || !giveaway.winners.length) return
        const oldGiveaway = giveaway.clone()
        amount ??= giveaway.winnersCount

        const { entries, winners, previousWinners } = giveaway
        giveaway.previousWinners = [...new Set([...previousWinners || [], ...winners])]

        const eligibleEntries = unique ? entries.filter((e) => !giveaway.previousWinners!.includes(e)) : entries
        let newWinners = this._pickWinners(eligibleEntries, amount)

        if (!newWinners.length) newWinners = this._pickWinners(entries, amount)
        giveaway.winners = newWinners

        if (this.giveaways.options.useDefault) {
            const msg = await this.fetchMessage(giveaway.channelID, giveaway.messageID)

            if (msg) {
                const plural = newWinners.length === 1 ? "" : "s"

                msg.reply({
                    content: `🔁 Rerolled giveaway, congratulations to the new winner${plural}!\n🏆 **New Winner${plural}:** ${this._parseMentions(newWinners)}`,
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(noop)
            } else {
                throwGiveawaysError(GiveawaysErrorType.MessageNotFound, giveaway.id)
                return
            }
        }

        await Database.set(giveaway).catch(noop)
        this.giveaways.emitter.emit("giveawayReroll", oldGiveaway, giveaway)

        return giveaway
    }

    // WIP
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
        // this.giveaways.emitter.emit("giveawayEdit", oldGiveaway, giveaway)

        return giveaway
    }

    /**
     * Fetches the message of a giveaway.
     * @param channelID The id of the channel to pull message from.
     * @param messageID The id of the message to fetch.
     * @returns 
     */
    public async fetchMessage(channelID: Snowflake, messageID?: Snowflake) {
        if (!messageID) return
        const chan = this.client.channels.cache.get(channelID) as TextChannel | undefined
        return chan?.messages.cache.get(messageID) ?? await chan?.messages.fetch(messageID).catch(() => {})
    }

    /**
     * Randomly picks X amount of winners from the provided entries.
     * @param entries The entries to pick winners from.
     * @param amount The amount of winners to pick.
     * @returns 
     */
    private _pickWinners(entries: Snowflake[], amount: number) {
        const shuffled = [...entries].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, amount)
    }

    /**
     * Parses the mentions for all giveaway winners.
     * @param winners The winners to parse mentions for.
     * @returns 
     */
    private _parseMentions(winners: Snowflake[]) {
        return winners.map((id) => `<@${id}>`).join(", ")
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