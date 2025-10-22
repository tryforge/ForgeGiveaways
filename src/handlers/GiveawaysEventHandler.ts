import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { Giveaway } from "../structures"
import { ForgeGiveaways } from ".."
import { Interaction } from "discord.js"

export interface IGiveawayEvents {
    databaseConnect: []
    giveawayStart: [Giveaway]
    giveawayEnd: [Giveaway]
    giveawayReroll: [Giveaway, Giveaway]
    giveawayEntryAdd: [Giveaway, Giveaway, Interaction]
    giveawayEntryRemove: [Giveaway, Giveaway, Interaction]
    giveawayEntryRevoke: [Giveaway, Interaction]
}

export class GiveawaysEventHandler<T extends keyof IGiveawayEvents> extends BaseEventHandler<IGiveawayEvents, T> {
    register(client: ForgeClient) {
        // @ts-ignore
        client.getExtension(ForgeGiveaways, true).emitter.on(this.name, this.listener.bind(client))
    }
}