import { ArgType } from "@tryforge/forgescript"

export default function<T extends ArgType>(value?: any) {
    return value ?? null
}