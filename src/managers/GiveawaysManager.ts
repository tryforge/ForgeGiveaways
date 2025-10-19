import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake, TextChannel, time } from "discord.js"
import { Compiler, Context, ForgeClient, Interpreter } from "@tryforge/forgescript"
import { TransformEvents } from "@tryforge/forge.db"
import { TypedEmitter } from "tiny-typed-emitter"
import { Database, Giveaway, IGiveawayRequirements } from "../structures"
import { GiveawaysErrorType, throwGiveawaysError } from "../functions/error"
import { IGiveawayEvents } from "./GiveawaysEventManager"
import { ForgeGiveaways } from ".."

export interface IGiveawayStartOptions {
    prize: string
    duration: number
    winnersCount: number
    hostID: Snowflake
    guildID: Snowflake
    channelID: Snowflake
    requirements?: IGiveawayRequirements
}

export class GiveawaysManager {
    public constructor(
        private readonly giveaways: ForgeGiveaways,
        private readonly client: ForgeClient,
        private emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>
    ) {
        this._restoreGiveaways()
    }

    /**
     * Starts a new giveaway on a guild.
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns 
     */
    public async start(ctx: Context, options: IGiveawayStartOptions) {
        const giveaway = new Giveaway(options)
        const chan = ctx.client.channels.cache.get(giveaway.channelID) as TextChannel | undefined

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
            }).catch(ctx.noop)

            if (!msg) {
                throwGiveawaysError(GiveawaysErrorType.MessageNotFound, giveaway.id)
                return
            }

            giveaway.messageID = msg.id
        }

        await Database.set(giveaway).catch(ctx.noop)
        this.emitter.emit("giveawayStart", giveaway)
        setTimeout(async () => await this.end(giveaway.id, ctx), giveaway.duration)

        return giveaway
    }

    /**
     * Ends an existing giveaway.
     * @param id The id of the giveaway to end.
     * @param ctx The optional current context.
     * @returns 
     */
    public async end(id: Snowflake, ctx?: Context) {
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
            const msg = giveaway.messageID ? await chan?.messages.fetch(giveaway.messageID).catch(ctx?.noop) : undefined

            if (msg) {
                const oldEmbed = msg.embeds[0]
                const embed = EmbedBuilder.from(oldEmbed)
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .spliceFields(0, 1, { name: "Ended", value: oldEmbed.fields[0].value, inline: true })
                    .setColor("Red")

                msg.edit({
                    embeds: [embed],
                    components: []
                }).catch(ctx?.noop)

                const plural = winners.length > 1 ? "s" : ""
                msg.reply({
                    content: winners.length === 0
                        ? "😢 No winners for this giveaway!"
                        : `🎉 Congratulations to the winner${plural} of **${giveaway.prize}**!\n> 🏆 **Winner${plural}:** ${winners.map((id) => `<@${id}>`).join(", ")}`,
                    allowedMentions: {
                        repliedUser: false,
                        parse: ["users"]
                    }
                }).catch(ctx?.noop)
            }
        }

        await Database.set(giveaway).catch(ctx?.noop)
        this.emitter.emit("giveawayEnd", giveaway)

        return giveaway
    }

    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns 
     */
    public async reroll(ctx: Context, id: Snowflake) {
        const giveaway = await Database.get(id)
        if (!giveaway || !giveaway.hasEnded) return null
        const oldGiveaway = giveaway.clone()

        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e))
        const newWinners = this._pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = newWinners

        await Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: Compiler.compile(this.giveaways.options?.messages?.reroll),
            doNotSend: true,
        })

        await Database.set(giveaway).catch(ctx.noop)
        this.emitter.emit("giveawayReroll", oldGiveaway, giveaway)

        return giveaway
    }

    private _pickWinners(entries: Snowflake[], amount: number) {
        const shuffled = entries.sort(() => Math.random() - 0.5)
        return shuffled.slice(0, amount)
    }

    private async _restoreGiveaways() {
        const giveaways = await Database.getAll()
        if (!giveaways) return

        for (const giveaway of giveaways) {
            if (giveaway.hasEnded) continue

            if (giveaway.timeLeft() > 0) {
                setTimeout(async () => await this.end(giveaway.id), giveaway.timeLeft())
            } else {
                await this.end(giveaway.id)
            }
        }
    }
}