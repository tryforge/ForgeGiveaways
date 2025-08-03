import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript"
import { GiveawaysEvents } from "./managers/GiveawaysEventManager"
import { GiveawaysCommandManager } from "./managers/GiveawaysCommandManager"
import { DatabaseType, Giveaways } from "discord-giveaways-super"

export interface IGiveawayOptions {
    path: `${string}.json`,
    events?: keyof GiveawaysEvents
}

export class ForgeGiveaways extends ForgeExtension {
    name = "ForgeGiveaways"
    description = ""
    version = require("../package.json").version

    commands: GiveawaysCommandManager | null
    giveawayManager: Giveaways<DatabaseType.JSON, `${string}.json`> | null
    #path: `${string}.json`

    public constructor (public readonly options: IGiveawayOptions) {
        super()
        this.commands = null
        this.giveawayManager = null
        this.#path = options.path
    }

    public init (client: ForgeClient) {
        this.giveawayManager = new Giveaways(client, {
            connection: {
                path: this.#path,
            },
            database: DatabaseType.JSON
        })
        this.commands = new GiveawaysCommandManager(client)

        EventManager.load("ForgeGiveawaysEvents", __dirname + "/events")
        this.load(__dirname + "/native")

        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events)
        }
    }
}