"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const discord_js_1 = require("discord.js");
const Giveaway_1 = require("./Giveaway");
class Context extends forgescript_1.Context {
    runtime;
    #cache = {};
    requirements = {};
    constructor(runtime) {
        super(runtime);
        this.runtime = runtime;
    }
    get obj() {
        return this.runtime.obj;
    }
    get extendedStates() {
        return this.runtime.states;
    }
    get giveaway() {
        return (this.#cache.giveaway ??=
            "giveaway" in this.obj
                ? this.obj.giveaway
                : this.obj instanceof Giveaway_1.Giveaway
                    ? this.obj
                    : null);
    }
    get interaction() {
        return (this.#cache.interaction ??=
            "baseInteraction" in this.obj
                ? this.obj.baseInteraction
                : this.obj instanceof discord_js_1.BaseInteraction
                    ? this.obj
                    : null);
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map