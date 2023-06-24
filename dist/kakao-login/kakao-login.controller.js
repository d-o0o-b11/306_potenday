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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoLoginController = void 0;
const common_1 = require("@nestjs/common");
const kakao_login_service_1 = require("./kakao-login.service");
const create_kakao_login_dto_1 = require("./dto/create-kakao-login.dto");
const update_kakao_login_dto_1 = require("./dto/update-kakao-login.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let KakaoLoginController = exports.KakaoLoginController = class KakaoLoginController {
    constructor(kakaoLoginService) {
        this.kakaoLoginService = kakaoLoginService;
    }
    async kakaoLogin() {
        return "로그인 완료";
    }
    async rediretLogin() {
        return "왔다";
    }
    async handleKakaoCallback(code) {
        console.log("code", code);
    }
    create(createKakaoLoginDto) {
        return this.kakaoLoginService.create(createKakaoLoginDto);
    }
    findAll() {
        return this.kakaoLoginService.findAll();
    }
    findOne(id) {
        return this.kakaoLoginService.findOne(+id);
    }
    update(id, updateKakaoLoginDto) {
        return this.kakaoLoginService.update(+id, updateKakaoLoginDto);
    }
    remove(id) {
        return this.kakaoLoginService.remove(+id);
    }
};
__decorate([
    (0, common_1.Get)("login"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KakaoLoginController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)("login2"),
    (0, common_1.Redirect)(`https://kauth.kakao.com/oauth/authorize?client_id=2a454928d20431c58b2e9e199c9cf847&redirect_uri=http://localhost:3000/kakao-login/kakao-callback&response_type=code`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KakaoLoginController.prototype, "rediretLogin", null);
__decorate([
    (0, common_1.Get)("kakao-callback"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KakaoLoginController.prototype, "handleKakaoCallback", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kakao_login_dto_1.CreateKakaoLoginDto]),
    __metadata("design:returntype", void 0)
], KakaoLoginController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KakaoLoginController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KakaoLoginController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kakao_login_dto_1.UpdateKakaoLoginDto]),
    __metadata("design:returntype", void 0)
], KakaoLoginController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KakaoLoginController.prototype, "remove", null);
exports.KakaoLoginController = KakaoLoginController = __decorate([
    (0, swagger_1.ApiTags)("로그인 API"),
    (0, common_1.Controller)("kakao-login"),
    __metadata("design:paramtypes", [kakao_login_service_1.KakaoLoginService])
], KakaoLoginController);
//# sourceMappingURL=kakao-login.controller.js.map