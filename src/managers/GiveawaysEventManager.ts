import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { DatabaseType, IGiveawaysEvents } from "discord-giveaways-super"
import { ForgeGiveaways } from ".."

export type GiveawaysEvents = IGiveawaysEvents<DatabaseType.JSON>

export class GiveawaysEventHandler<T extends keyof GiveawaysEvents> extends BaseEventHandler<GiveawaysEvents, T> {
    register(client: ForgeClient): void {
        //@ts-ignore
        client.getExtension(ForgeGiveaways, true).giveawayManager.on(this.name, this.listener.bind(client))
    }
}