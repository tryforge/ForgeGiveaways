import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { Giveaway } from "../structures"
import { ForgeGiveaways } from ".."

export interface IGiveawayEvents {
    giveawayStart: [
        {
            newData: Giveaway | null
        }
    ]
    giveawayEnd: [
        {
            newData: Giveaway | null
        }
    ]
    giveawayEdit: [
        {
            newData: Giveaway | null
            oldData: Giveaway | null
        }
    ]
    giveawayReroll: [
        {
            newData: Giveaway | null
            oldData: Giveaway | null
        }
    ]
}

export class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient) {
        // @ts-ignore
        client.getExtension(ForgeGiveaways, true).emitter.on(this.name, this.listener.bind(client))
    }
}