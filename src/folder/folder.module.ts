import { Module } from "@nestjs/common";
import {
  CreateFolderCommandHandler,
  CreateFolderController,
  DeleteFolderCommandHandler,
  DeleteFolderController,
  UpdateFolderCommandHandler,
  UpdateFolderController,
} from "./commands";
import { CqrsModule } from "@nestjs/cqrs";
import {
  FindFolderCardListController,
  FindFolderCardListQueryHandler,
  FindFolderController,
  FindFolderQueryHandler,
} from "./queries";

const commands = [
  CreateFolderCommandHandler,
  DeleteFolderCommandHandler,
  UpdateFolderCommandHandler,
];
const queries = [FindFolderQueryHandler, FindFolderCardListQueryHandler];
const controllers = [
  CreateFolderController,
  DeleteFolderController,
  UpdateFolderController,
  FindFolderController,
  FindFolderCardListController,
];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [...commands, ...queries],
  exports: [],
})
export class FolderModule {}
