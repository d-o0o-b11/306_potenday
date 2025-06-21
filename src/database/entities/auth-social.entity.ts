import { IsNumber, IsString, IsUUID, Length } from "class-validator";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { UUID } from "src/common";

@Index("idx_social_external_id_social_code", ["externalId", "socialCode"], {
  unique: true,
})
@Entity({
  schema: "auth",
  name: "social",
})
export class AuthSocial extends BaseEntity {
  /**
   * 소셜 정보 PK
   * @example uuid
   */
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "pk_idx_social_id",
  })
  @IsUUID()
  id: string;

  /**
   * 소셜 서비스에서 발급받은 유저 고유 ID
   * @example '1234567890'
   */
  @Column({
    name: "external_id",
    type: "varchar",
    length: 255,
  })
  @IsString()
  @Length(1, 255)
  externalId: string;

  /**
   * 소셜 구분 코드
   */
  @Column({
    name: "social_code",
    type: "int2",
  })
  @IsNumber()
  socialCode: number;

  /**
   * 유저 FK
   * @example uuid
   */
  @Index("idx_auth_social_user_id")
  @Column({
    name: "user_id",
    type: "uuid",
  })
  @IsUUID()
  userId: UUID;

  /**
   * 유저 정보
   */
  @OneToOne(() => User, (user) => user.social, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_user_id",
  })
  user: User;
}
