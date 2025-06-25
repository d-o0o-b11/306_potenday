import { Module } from "@nestjs/common";
import { InfoController, InfoQueryHandler } from "./queries";
import { CqrsModule } from "@nestjs/cqrs";
import { UpdateInfoCommandHandler, UpdateInfoController } from "./commands";

const queries = [InfoQueryHandler];
const commands = [UpdateInfoCommandHandler];
const controllers = [InfoController, UpdateInfoController];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [...queries, ...commands],
  exports: [],
})
export class UserModule {}
