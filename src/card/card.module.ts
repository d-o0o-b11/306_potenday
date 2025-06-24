import { Module } from "@nestjs/common";
import {
  CreateCardCommandHandler,
  CreateCardController,
  DeleteCardCommandHandler,
  DeleteCardController,
  UpdateCardCommandHandler,
  UpdateCardController,
  UpdateStatusCardCommandHandler,
  UpdateStatusCardController,
} from "./commands";
import { CqrsModule } from "@nestjs/cqrs";
import {
  FindCardController,
  FindCardQueryHandler,
  FindTitleCardController,
  FindTitleCardQueryHandler,
} from "./queries";

const commands = [
  CreateCardCommandHandler,
  DeleteCardCommandHandler,
  UpdateCardCommandHandler,
  UpdateStatusCardCommandHandler,
];
const queries = [FindCardQueryHandler, FindTitleCardQueryHandler];
const controllers = [
  CreateCardController,
  DeleteCardController,
  UpdateCardController,
  UpdateStatusCardController,
  FindCardController,
  FindTitleCardController,
];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [...commands, ...queries],
  exports: [],
})
export class CardModule {}
