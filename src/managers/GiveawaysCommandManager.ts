import { BaseCommandManager } from "@tryforge/forgescript"
import { IGiveawayEvents } from "./GiveawaysEventManager"

export class GiveawaysCommandManager extends BaseCommandManager<keyof IGiveawayEvents> {
    handlerName = "ForgeGiveawaysEvents"
}