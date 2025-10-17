import { Compiler, Context, Interpreter } from "@tryforge/forgescript"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder, Snowflake, TextChannel, time } from "discord.js"
import { ForgeGiveaways, IGiveawayEvents } from ".."
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Giveaway } from "../structures"

export interface IGiveawayStartOptions {
    prize: string
    duration: number
    winnersCount: number
    hostID: Snowflake
    guildID: Snowflake
    channelID: Snowflake
    requirements?: {
        requiredRoles?: Snowflake[]
        restrictedRoles?: Snowflake[]
        restrictedMembers?: Snowflake[]
    }
}

export class GiveawaysManager {
    private readonly giveaways = new Collection<Snowflake, Giveaway>()

    public constructor(
        private readonly client: ForgeGiveaways,
        private emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>
    ) {}

    /**
     * Gets an existing giveaway.
     * @param id The id of the giveaway to get.
     * @returns 
     */
    public get(id: Snowflake) {
        return this.giveaways.get(id)
    }

    /**
     * Gets all existing giveaways.
     * @returns 
     */
    public getAll() {
        return this.giveaways
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

        if (this.client.options?.messages?.start) {
            const result = await Interpreter.run({
                ...ctx.runtime,
                environment: { giveaway },
                data: Compiler.compile(this.client.options?.messages?.start),
                doNotSend: true,
            })

            const res = result?.trim()
            giveaway.messageID = (res && chan?.messages.cache.get(res) ? res : undefined)
        } else {
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
            })
            giveaway.messageID = msg?.id
        }

        this.emitter.emit("giveawayStart", giveaway)
        this.giveaways.set(giveaway.id, giveaway)
        setTimeout(() => this.end(ctx, giveaway.id), giveaway.duration)

        return giveaway
    }

    /**
     * Ends an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to end.
     * @returns 
     */
    public async end(ctx: Context, id: Snowflake) {
        const giveaway = this.get(id)
        if (!giveaway || giveaway.hasEnded()) return null

        const guild = ctx.client.guilds.cache.get(giveaway.guildID)
        const eligibleEntries = giveaway.entries.filter((e) => {
            const member = guild?.members.cache.get(e)
            return member && giveaway.canEnter(member)
        })
        const winners = this._pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = winners

        await Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: Compiler.compile(this.client.options?.messages?.end || `
                $!editMessage[$env[giveaway;channelID];$env[giveaway;messageID];
                    $fetchEmbeds[$env[giveaway;channelID];$env[giveaway;messageID]]
                    $title[🎉 GIVEAWAY ENDED 🎉]
                    $color[Red]
                ]
            `),
            doNotSend: true,
        })

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
        const giveaway = this.get(id)
        if (!giveaway || !giveaway.hasEnded()) return null
        const oldGiveaway = giveaway

        const eligibleEntries = giveaway.entries.filter((e) => !giveaway.winners.includes(e))
        const newWinners = this._pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = newWinners

        await Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: Compiler.compile(this.client.options?.messages?.reroll),
            doNotSend: true,
        })

        this.emitter.emit("giveawayReroll", giveaway, oldGiveaway)

        return giveaway
    }

    private _pickWinners(entries: Snowflake[], amount: number) {
        const shuffled = entries.sort(() => Math.random() - 0.5)
        return shuffled.slice(0, amount)
    }
}
