import { ArgType, NativeFunction } from "@tryforge/forgescript";
import { GiveawayProperty } from "../../properties/giveaway";
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.Enum;
    enum: typeof GiveawayProperty;
}, {
    name: string;
    description: string;
    rest: false;
    type: ArgType.String;
}], true>;
export default _default;
//# sourceMappingURL=getAllGiveaways.d.ts.map