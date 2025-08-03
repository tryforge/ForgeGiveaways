import { BaseCommandManager } from "@tryforge/forgescript"
import { GiveawaysEvents } from "./GiveawaysEventManager"

export class GiveawaysCommandManager extends BaseCommandManager<keyof GiveawaysEvents> {
    handlerName = "ForgeGiveawaysEvents"
}