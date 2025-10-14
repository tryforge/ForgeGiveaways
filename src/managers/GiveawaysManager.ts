import { Compiler, Context, Interpreter } from "@tryforge/forgescript"
import { Collection, Snowflake, SnowflakeUtil } from "discord.js"
import { ForgeGiveaways } from ".."

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
    messageID: Snowflake
    entries: Snowflake[]
    winners: Snowflake[]
}

export class GiveawaysManager {
    private readonly giveaways = new Collection<Snowflake, IGiveaway>()

    public constructor(private readonly client: ForgeGiveaways) {}

    public async start(ctx: Context, options: IGiveawayStartOptions) {
        const id = SnowflakeUtil.generate().toString()

        await Interpreter.run({
            ...ctx.runtime,
            data: Compiler.compile(this.client.options.messages?.start),
            doNotSend: false
        })

        const giveaway = {
            ...options,
            id,
            messageID: "",
            entries: [],
            winners: []
        } as IGiveaway

        this.giveaways.set(id, giveaway)
        setTimeout(() => this.end(ctx, id), options.duration)
        return giveaway
    }

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
            data: Compiler.compile(this.client.options.messages?.end),
            doNotSend: false,
        })

        return giveaway
    }

    public async reroll(ctx: Context, id: Snowflake) {
        const giveaway = this.giveaways.get(id)
        if (!giveaway) return null

        const eligibleEntries = giveaway.entries.filter(e => !giveaway.winners.includes(e))
        const newWinners = this.pickWinners(eligibleEntries, giveaway.winnersCount)
        giveaway.winners = newWinners

        await Interpreter.run({
            ...ctx.runtime,
            data: Compiler.compile(this.client.options.messages?.reroll),
            doNotSend: false,
        })

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
