import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateInfoCommand } from "./update-info.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { User } from "src/database";
import { UserMapper } from "../../mappers";
import { UpdateInfoResponseDto } from "./update-info.dto";

@CommandHandler(UpdateInfoCommand)
export class UpdateInfoCommandHandler
  implements ICommandHandler<UpdateInfoCommand>
{
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager
  ) {}

  async execute(command: UpdateInfoCommand): Promise<UpdateInfoResponseDto> {
    const { userId, name, email, emailActive } = command;

    const findUser = await this.manager.findOne(User, {
      where: { id: userId },
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    const user = UserMapper.toDomain(findUser);
    user.updateInfo({ name, email, emailActive });

    const result = await this.manager.save(
      User,
      UserMapper.toPersistence(user)
    );

    return {
      userId: result.id,
      name: result.name,
      email: result.email,
      emailActive: result.emailActive,
      profile: result.profile,
    };
  }
}
