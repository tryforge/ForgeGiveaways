import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript"
import { IGiveawayEvents } from "./managers/GiveawaysEventManager"
import { GiveawaysCommandManager } from "./managers/GiveawaysCommandManager"
import { GiveawaysManager } from "./managers/GiveawaysManager"

export interface IForgeGiveawaysOptions {
    events?: keyof IGiveawayEvents
    messages?: {
        start?: string
        end?: string
        reroll?: string
    }
}

export class ForgeGiveaways extends ForgeExtension {
    name = "ForgeGiveaways"
    description = ""
    version = require("../package.json").version

    public readonly giveawaysManager = new GiveawaysManager(this)
    commands: GiveawaysCommandManager | null

    public constructor (public readonly options: IForgeGiveawaysOptions) {
        super()
        this.commands = null
    }

    public init (client: ForgeClient) {
        this.commands = new GiveawaysCommandManager(client)

        EventManager.load("ForgeGiveawaysEvents", __dirname + "/events")
        this.load(__dirname + "/native")

        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events)
        }
    }
}

export * from "./managers"