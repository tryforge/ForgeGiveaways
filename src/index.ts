import { EventManager, ForgeClient, ForgeExtension, Logger } from "@tryforge/forgescript"
import { GiveawaysCommandManager, GiveawaysManager } from "./managers"
import { GiveawaysInteractionHandler, GiveawaysReactionHandler, IGiveawayEvents } from "./handlers"
import { TypedEmitter } from "tiny-typed-emitter"
import { TransformEvents } from "@tryforge/forge.db"
import { Database } from "./structures"
import { GiveawaysErrorType } from "./functions/error"
import { description, version } from "../package.json"

export interface IForgeGiveawaysOptions {
    /**
     * The giveaway events to use.
     */
    events?: Array<keyof IGiveawayEvents>

    /**
     * Whether to use the default giveaway messages. Defaults to `true`.
     */
    useDefault?: boolean

    /**
     * Whether to use reactions for entering the giveaways. Defaults to `false`.
     */
    useReactions?: boolean
}

export class ForgeGiveaways extends ForgeExtension {
    name = "forge.giveaways"
    description = description
    version = version
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

        if (this.options.useReactions) new GiveawaysReactionHandler(client)
        else new GiveawaysInteractionHandler(client)

        if (this.options.events?.length) {
            client.events.load("ForgeGiveawaysEvents", this.options.events)

            if (!this.options.useDefault && !this.options.events.includes("giveawayStart")) {
                throw new Error(GiveawaysErrorType.MissingStartEvent)
            }

            if (this.options.useReactions && !client.options.intents.has("GuildMessageReactions")) {
                Logger.warn(`[ForgeGiveaways] Intent "GuildMessageReactions" must be defined for reactions to function`)
            }
        }

        await new Database(this.emitter).init()
        this.giveawaysManager = new GiveawaysManager(client)
    }
}

export * from "./handlers"
export * from "./managers"
export * from "./structures"
export * from "./types"