import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript"
import { IGiveawayEvents, GiveawaysCommandManager, GiveawaysInteractionManager, GiveawaysManager } from "./managers"
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Database } from "./structures"

export interface IForgeGiveawaysOptions {
    /**
     * The giveaway events to use.
     */
    events?: keyof IGiveawayEvents

    /**
     * Whether to use the default giveaway messages. Defaults to `true`.
     */
    useDefault?: boolean
}

export class ForgeGiveaways extends ForgeExtension {
    name = "forge.giveaways"
    description = require("../package.json").description
    version = require("../package.json").version
    requireExtensions = ["forge.db"]

    public emitter = new TypedEmitter<TransformEvents<IGiveawayEvents>>()

    public giveawaysManager!: GiveawaysManager
    public commands!: GiveawaysCommandManager

    public constructor (public readonly options: IForgeGiveawaysOptions = {}) {
        super()
        this.options.useDefault ??= true
    }

    public async init(client: ForgeClient) {
        this.commands = new GiveawaysCommandManager(client)

        EventManager.load("ForgeGiveawaysEvents", __dirname + "/events")
        this.load(__dirname + "/native")

        new GiveawaysInteractionManager(client)

        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events)
        }

        await new Database(this.emitter).init()
        this.giveawaysManager = new GiveawaysManager(this, client)
    }
}

export * from "./managers"
export * from "./structures"
export * from "./types"