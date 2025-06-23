import { UUID } from "src/common";
import { User } from "../domain";
import { User as UserEntity } from "src/database";

export class UserMapper {
  static toPersistence(user: User): UserEntity {
    const props = user.getProps();

    const entity = new UserEntity();
    entity.id = user.id.unpack();
    entity.name = props.name;
    entity.profile = props.profile;
    entity.email = props.email;
    entity.emailActive = props.emailActive;

    return entity;
  }

  static toDomain(entity: UserEntity): User {
    return new User({
      id: UUID.create(entity.id),
      props: {
        name: entity.name,
        profile: entity.profile,
        email: entity.email,
        emailActive: entity.emailActive,
      },
    });
  }
}
