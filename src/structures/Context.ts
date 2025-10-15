import { Context as ctx } from "@tryforge/forgescript"
import { Giveaway } from "../managers/Giveaway"

export class Context extends ctx {
    giveaway?: Giveaway
}