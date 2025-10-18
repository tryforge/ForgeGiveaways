import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript"
import { IGiveawayEvents, GiveawaysCommandManager, GiveawaysInteractionManager, GiveawaysManager } from "./managers"
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Database } from "./structures"

export interface IForgeGiveawaysOptions {
    events?: keyof IGiveawayEvents
    messages?: {
        start: string
        end: string
        reroll: string
    }
}

export class ForgeGiveaways extends ForgeExtension {
    name = "forge.giveaways"
    description = ""
    version = require("../package.json").version
    requireExtensions = ["forge.db"]

    public emitter = new TypedEmitter<TransformEvents<IGiveawayEvents>>()

    public readonly database: Database
    public readonly giveawaysManager = new GiveawaysManager(this, this.emitter)
    commands: GiveawaysCommandManager | null

    public constructor (public readonly options?: IForgeGiveawaysOptions) {
        super()
        this.commands = null
        this.database = new Database(this.emitter)
    }

    public async init(client: ForgeClient) {
        this.commands = new GiveawaysCommandManager(client)

        EventManager.load("ForgeGiveawaysEvents", __dirname + "/events")
        this.load(__dirname + "/native")

        new GiveawaysInteractionManager(client)

        if (this.options?.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events)
        }

        await this.database.init()
    }
}