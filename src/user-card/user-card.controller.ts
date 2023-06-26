import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCardService } from './user-card.service';
import { CreateUserCardDto } from './dto/create-user-card.dto';
import { UpdateUserCardDto } from './dto/update-user-card.dto';

@Controller('user-card')
export class UserCardController {
  constructor(private readonly userCardService: UserCardService) {}

  @Post()
  create(@Body() createUserCardDto: CreateUserCardDto) {
    return this.userCardService.create(createUserCardDto);
  }

  @Get()
  findAll() {
    return this.userCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCardDto: UpdateUserCardDto) {
    return this.userCardService.update(+id, updateUserCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCardService.remove(+id);
  }
}
