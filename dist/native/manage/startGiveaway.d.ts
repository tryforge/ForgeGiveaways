import { ArgType, NativeFunction } from "@tryforge/forgescript";
import { BaseChannel } from "discord.js";
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.Channel;
    check: (i: BaseChannel) => boolean;
}, {
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.Member;
    pointer: number;
    pointerProperty: string;
}, {
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.String;
}, {
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.Time;
}, {
    name: string;
    description: string;
    rest: false;
    type: ArgType.Number;
}], true>;
export default _default;
//# sourceMappingURL=startGiveaway.d.ts.map