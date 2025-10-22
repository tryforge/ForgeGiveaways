import { Logger } from "@tryforge/forgescript"

export default (...args: any[]) => {
    Logger.error("[ForgeGiveaways]", ...args)
}