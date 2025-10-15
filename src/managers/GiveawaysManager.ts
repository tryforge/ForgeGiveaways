import { Compiler, Context, Interpreter } from "@tryforge/forgescript"
import { Collection, Snowflake, SnowflakeUtil, TextChannel } from "discord.js"
import { ForgeGiveaways, IGiveawayEvents } from ".."
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"

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

export interface IGiveaway extends IGiveawayStartOptions {
    id: Snowflake
    messageID?: Snowflake
    entries: Snowflake[]
    winners: Snowflake[]
}

export class GiveawaysManager {
    private readonly giveaways = new Collection<Snowflake, IGiveaway>()

    public constructor(
        private readonly client: ForgeGiveaways,
        private emitter: TypedEmitter<TransformEvents<IGiveawayEvents>>
    ) {}

    /**
     * 
     * @param ctx The current context.
     * @param options The start options for the giveaway.
     * @returns 
     */
    public async start(ctx: Context, options: IGiveawayStartOptions) {
        const id = SnowflakeUtil.generate().toString()

        const giveaway = {
            ...options,
            id,
            entries: [],
            winners: []
        } as IGiveaway

        const result = await Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: Compiler.compile(this.client.options?.messages?.start || `
                $sendMessage[$env[giveaway;channelID];
                    $title[🎉 GIVEAWAY 🎉]
                    $description[**Prize:** $env[giveaway;prize]\n**Winners:** $env[giveaway;winnersCount]]
                    $addField[Ends;<t:$floor[$math[$getTimestamp+$env[giveaway;duration]]]:R>;true]
                    $addField[Hosted by;<@$env[giveaway;hostID]>;true]
                    $color[Green]
                    $addActionRow
                    $addButton[giveaway;Enter;Primary]
                ;true]
            `),
            doNotSend: true,
        })

        const res = result?.trim()
        const chan = ctx.client.channels.cache.get(giveaway.channelID)
        giveaway.messageID = (res && (chan as TextChannel)?.messages.cache.get(res) ? res : undefined)

        this.emitter.emit("giveawayStart", { data: giveaway })

        this.giveaways.set(id, giveaway)
        setTimeout(() => this.end(ctx, id), options.duration)
        return giveaway
    }

    /**
     * 
     * @param ctx The current context.
     * @param id The id of the giveaway to end.
     * @returns 
     */
    public async end(ctx: Context, id: Snowflake) {
        const giveaway = this.giveaways.get(id)
        if (!giveaway) return null

        const eligibleEntries = giveaway.entries.filter(entry => {
            const member = ctx.guild?.members.cache.get(entry)
            if (!member) return false

            const { requirements } = giveaway
            const hasRequiredRoles = requirements?.requiredRoles?.every(x => member.roles.cache.has(x)) ?? true
            const noRestrictedRoles = requirements?.restrictedRoles?.every(x => !member.roles.cache.has(x)) ?? true
            const notRestrictedMember = !requirements?.restrictedMembers?.includes(member.id)

            return hasRequiredRoles && noRestrictedRoles && notRestrictedMember
        })

        const winners = this.pickWinners(eligibleEntries, giveaway.winnersCount)
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

        this.emitter.emit("giveawayEnd", { data: giveaway })

        return giveaway
    }

    /**
     * Rerolls an existing giveaway.
     * @param ctx The current context.
     * @param id The id of the giveaway to reroll.
     * @returns 
     */
    public async reroll(ctx: Context, id: Snowflake) {
        const giveaway = this.giveaways.get(id)
        if (!giveaway) return null
        const oldGiveaway = giveaway

        const eligibleEntries = giveaway.entries.filter(e => !giveaway.winners.includes(e))
        const newWinners = this.pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = newWinners

        await Interpreter.run({
            ...ctx.runtime,
            environment: { giveaway },
            data: Compiler.compile(this.client.options?.messages?.reroll),
            doNotSend: true,
        })

        this.emitter.emit("giveawayReroll", { newData: giveaway, oldData: oldGiveaway })

        return giveaway
    }

    public addEntry(id: Snowflake, userID: Snowflake) {
        const giveaway = this.giveaways.get(id)
        if (!giveaway || giveaway.entries.includes(userID)) return false

        giveaway.entries.push(userID)
        return true
    }

    public removeEntry(id: Snowflake, userID: Snowflake) {
        const giveaway = this.giveaways.get(id)
        if (!giveaway) return false

        const index = giveaway.entries.indexOf(userID)
        if (index === -1) return false

        giveaway.entries.splice(index, 1)
        return true
    }

    private pickWinners(entries: Snowflake[], amount: number) {
        const shuffled = entries.sort(() => Math.random() - 0.5)
        return shuffled.slice(0, amount)
    }
}
