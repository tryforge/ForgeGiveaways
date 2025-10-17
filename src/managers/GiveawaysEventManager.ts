import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { Giveaway } from "../structures"
import { ForgeGiveaways } from ".."

export interface IGiveawayEvents {
    giveawayStart: [Giveaway]
    giveawayEnd: [Giveaway]
    giveawayEdit: [Giveaway, Giveaway]
    giveawayReroll: [Giveaway, Giveaway]
    giveawayEntryAdd: [Giveaway, Giveaway]
    giveawayEntryRemove: [Giveaway, Giveaway]
}

export class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient) {
        // @ts-ignore
        client.getExtension(ForgeGiveaways, true).emitter.on(this.name, this.listener.bind(client))
    }
}