"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetUpConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
class SetUpConfig {
    constructor(app) {
        this.app = app;
    }
    async setUp() {
        this.swaggerConfig();
        this.setCORS();
    }
    async setListen(port) {
        await this.app.listen(port);
    }
    swaggerConfig() {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("POTEN_DAY SWAGGER")
            .setDescription("poten day API description")
            .setVersion("1.0.0")
            .addTag("swagger")
            .addServer("http://localhost:3000")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(this.app, config);
        swagger_1.SwaggerModule.setup("swagger", this.app, document);
    }
    setCORS() {
        this.app.enableCors({
            origin: "http://localhost:3000",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
            allowedHeaders: "*",
        });
    }
}
exports.SetUpConfig = SetUpConfig;
//# sourceMappingURL=setup.config.js.map