"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoLoginModule = void 0;
const common_1 = require("@nestjs/common");
const kakao_login_service_1 = require("./kakao-login.service");
const kakao_login_controller_1 = require("./kakao-login.controller");
const passport_1 = require("@nestjs/passport");
const jwt_kakao_strategy_1 = require("./jwt-kakao.strategy");
let KakaoLoginModule = exports.KakaoLoginModule = class KakaoLoginModule {
};
exports.KakaoLoginModule = KakaoLoginModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule],
        controllers: [kakao_login_controller_1.KakaoLoginController],
        providers: [kakao_login_service_1.KakaoLoginService, jwt_kakao_strategy_1.JwtKakaoStrategy],
    })
], KakaoLoginModule);
//# sourceMappingURL=kakao-login.module.js.map