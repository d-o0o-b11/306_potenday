"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoLoginService = void 0;
const common_1 = require("@nestjs/common");
let KakaoLoginService = exports.KakaoLoginService = class KakaoLoginService {
    create(createKakaoLoginDto) {
        return "This action adds a new kakaoLogin";
    }
    findAll() {
        return `This action returns all kakaoLogin`;
    }
    findOne(id) {
        return `This action returns a #${id} kakaoLogin`;
    }
    update(id, updateKakaoLoginDto) {
        return `This action updates a #${id} kakaoLogin`;
    }
    remove(id) {
        return `This action removes a #${id} kakaoLogin`;
    }
};
exports.KakaoLoginService = KakaoLoginService = __decorate([
    (0, common_1.Injectable)()
], KakaoLoginService);
//# sourceMappingURL=kakao-login.service.js.map