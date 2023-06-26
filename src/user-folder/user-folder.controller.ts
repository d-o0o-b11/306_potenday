import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserFolderService } from './user-folder.service';
import { CreateUserFolderDto } from './dto/create-user-folder.dto';
import { UpdateUserFolderDto } from './dto/update-user-folder.dto';

@Controller('user-folder')
export class UserFolderController {
  constructor(private readonly userFolderService: UserFolderService) {}

  @Post()
  create(@Body() createUserFolderDto: CreateUserFolderDto) {
    return this.userFolderService.create(createUserFolderDto);
  }

  @Get()
  findAll() {
    return this.userFolderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFolderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFolderDto: UpdateUserFolderDto) {
    return this.userFolderService.update(+id, updateUserFolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFolderService.remove(+id);
  }
}
