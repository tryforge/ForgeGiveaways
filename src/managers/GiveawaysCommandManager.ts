import { BaseCommandManager } from "@tryforge/forgescript"
import { IGiveawayEvents } from "../handlers/GiveawaysEventHandler"

export class GiveawaysCommandManager extends BaseCommandManager<keyof IGiveawayEvents> {
    handlerName = "ForgeGiveawaysEvents"
}