"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const setup_config_1 = require("./setup.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = new setup_config_1.SetUpConfig(app);
    await configService.setUp();
    await configService.setListen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map