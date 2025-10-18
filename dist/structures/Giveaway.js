"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaway = void 0;
const discord_js_1 = require("discord.js");
const typeorm_1 = require("typeorm");
let Giveaway = class Giveaway {
    /**
     * The id of this giveaway.
     */
    id;
    /**
     * The prize of this giveaway.
     */
    prize;
    /**
     * The duration of the giveaway in ms.
     */
    duration;
    /**
     * The max amount of winners for this giveaway.
     */
    winnersCount;
    /**
     * Returns whether this giveaway has ended.
     */
    hasEnded;
    /**
     * The id of the host for this giveaway.
     */
    hostID;
    /**
     * The id of the guild this giveaway has been created on.
     */
    guildID;
    /**
     * The id of the channel this giveaway has been created in.
     */
    channelID;
    /**
     * The user entries for this giveaway.
     */
    entries;
    /**
     * The randomly selected winners of this giveaway.
     */
    winners;
    /**
     * The requirements all participants have to meet for entering this giveaway.
     */
    requirements;
    /**
     * The id of the message this giveaway is associated with.
     */
    messageID;
    constructor(options) {
        this.id = options?.id ?? discord_js_1.SnowflakeUtil.generate().toString();
        this.prize = options?.prize ?? "";
        this.duration = options?.duration ?? 0;
        this.winnersCount = options?.winnersCount ?? 1;
        this.hostID = options?.hostID ?? "";
        this.guildID = options?.guildID ?? "";
        this.channelID = options?.channelID ?? "";
        this.requirements = options?.requirements;
        this.hasEnded = false;
        this.entries = [];
        this.winners = [];
    }
    /**
     * Returns whether a user has entered this giveaway.
     * @param userID The user to check for.
     * @returns
     */
    hasEntered(userID) {
        return this.entries.includes(userID);
    }
    /**
     * Adds a user entry to this giveaway.
     * @param userID The user to add as participant.
     * @returns
     */
    addEntry(userID) {
        if (this.hasEntered(userID))
            return null;
        this.entries.push(userID);
        return this;
    }
    /**
     * Removes a user entry from this giveaway.
     * @param userID The user to remove as participant.
     * @returns
     */
    removeEntry(userID) {
        if (!this.hasEntered(userID))
            return null;
        this.entries = this.entries.filter((e) => e !== userID);
        return this;
    }
    /**
     * Returns whether a member is eligible to enter this giveaway.
     * @param member The guild member to check for requirements.
     * @returns
     */
    canEnter(member) {
        const req = this.requirements;
        if (!req)
            return true;
        const hasRequiredRoles = req.requiredRoles?.every(r => member.roles.cache.has(r)) ?? true;
        const noRestrictedRoles = req.restrictedRoles?.every(r => !member.roles.cache.has(r)) ?? true;
        const notRestrictedMember = !req.restrictedMembers?.includes(member.id);
        return hasRequiredRoles && noRestrictedRoles && notRestrictedMember;
    }
    /**
     * Clones this giveaway.
     * @returns
     */
    clone() {
        return structuredClone(this);
    }
};
exports.Giveaway = Giveaway;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Giveaway.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Giveaway.prototype, "prize", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Giveaway.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Giveaway.prototype, "winnersCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Giveaway.prototype, "hasEnded", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Giveaway.prototype, "hostID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Giveaway.prototype, "guildID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Giveaway.prototype, "channelID", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Giveaway.prototype, "entries", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Giveaway.prototype, "winners", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json"),
    __metadata("design:type", Object)
], Giveaway.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Giveaway.prototype, "messageID", void 0);
exports.Giveaway = Giveaway = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Giveaway);
//# sourceMappingURL=Giveaway.js.map