import { Injectable } from "@nestjs/common";
import { CreateUserFolderDto } from "./dto/create-user-folder.dto";
import { UpdateUserFolderDto } from "./dto/update-user-folder.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DefaultFolderEntity } from "./entities/default-folder.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserFolderService {
  constructor(
    @InjectRepository(DefaultFolderEntity)
    private readonly defaultRepository: Repository<DefaultFolderEntity>
  ) {}

  create(createUserFolderDto: CreateUserFolderDto) {
    return "This action adds a new userFolder";
  }

  findAll() {
    return `This action returns all userFolder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFolder`;
  }

  update(id: number, updateUserFolderDto: UpdateUserFolderDto) {
    return `This action updates a #${id} userFolder`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFolder`;
  }
}
