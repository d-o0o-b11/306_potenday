import { PartialType } from '@nestjs/swagger';
import { CreateUserFolderDto } from './create-user-folder.dto';

export class UpdateUserFolderDto extends PartialType(CreateUserFolderDto) {}
