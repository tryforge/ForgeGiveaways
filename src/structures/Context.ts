import { Context as ctx } from "@tryforge/forgescript"
import { Giveaway } from "./Giveaway"

export class Context extends ctx {
    giveaway?: Giveaway
}