import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript"
import { GiveawaysCommandManager, GiveawaysManager } from "./managers"
import { GiveawaysInteractionHandler, IGiveawayEvents } from "./handlers"
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Database } from "./structures"
import { GiveawaysErrorType } from "./functions/error"

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

        new GiveawaysInteractionHandler(client)

        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events)
            const commands = this.commands.get("giveawayStart")
            if (commands.length > 1) throw new Error(GiveawaysErrorType.MultipleStartEvents)
        }

        await new Database(this.emitter).init()
        this.giveawaysManager = new GiveawaysManager(this, client)
    }
}

export * from "./handlers"
export * from "./managers"
export * from "./structures"
export * from "./types"