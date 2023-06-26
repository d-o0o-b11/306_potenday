import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserFolderService } from "./user-folder.service";
import { CreateUserFolderDto } from "./dto/create-user-folder.dto";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("유저 폴더 API")
@Controller("user-folder")
export class UserFolderController {
  constructor(private readonly userFolderService: UserFolderService) {}
}
