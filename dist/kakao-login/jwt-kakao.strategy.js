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
exports.JwtKakaoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_kakao_1 = require("passport-kakao");
let JwtKakaoStrategy = exports.JwtKakaoStrategy = class JwtKakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_1.Strategy, "kakao") {
    constructor() {
        console.log("JwtKakaoStrategy 생성자 호출됨");
        super({
            clientID: "2a454928d20431c58b2e9e199c9cf847",
            clientSecret: "OT2JzWylPCaajR8PMAv896NSRwRnWxju",
            callbackURL: "http://localhost:3000/kakao-login/kakao-callback",
            scope: ["profile_image", "profile_nickname", "account_email"],
        });
    }
    async validate(accessToken, refreshToken, profile) {
        console.log("accessToken" + accessToken);
        console.log("refreshToken" + refreshToken);
        console.log(profile);
        console.log("email", profile._json.kakao_account.email);
        return {
            name: profile.displayName,
            email: profile._json.kakao_account.email,
            password: profile.id,
        };
    }
};
exports.JwtKakaoStrategy = JwtKakaoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtKakaoStrategy);
//# sourceMappingURL=jwt-kakao.strategy.js.map