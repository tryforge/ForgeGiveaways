import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { IGiveaway } from "./GiveawaysManager"
import { ForgeGiveaways } from ".."

export interface IGiveawayEvents {
    giveawayStart: [
        {
            data: IGiveaway | null
        }
    ]
    giveawayEnd: [
        {
            data: IGiveaway | null
        }
    ]
    giveawayEdit: [
        {
            newData: IGiveaway | null
            oldData: IGiveaway | null
        }
    ]
    giveawayReroll: [
        {
            newData: IGiveaway | null
            oldData: IGiveaway | null
        }
    ]
}

export class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient) {
        // @ts-ignore
        client.getExtension(ForgeGiveaways, true).emitter.on(this.name, this.listener.bind(client))
    }
}