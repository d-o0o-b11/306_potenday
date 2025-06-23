import { Global, Module } from "@nestjs/common";
import { JwtManagerService } from "./providers";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
  providers: [JwtManagerService, JwtService],
  exports: [JwtManagerService],
})
export class CommonModule {}
