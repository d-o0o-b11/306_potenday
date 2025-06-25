import { IsBoolean, IsString, IsUUID, Length } from "class-validator";
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuthSocial } from "./auth-social.entity";
import { BaseEntity } from "./base.entity";
import { RefreshToken } from "./refresh-token.entity";
import { Folder } from "./folder.entity";
import { Card } from "./card.entity";

@Entity("user")
export class User extends BaseEntity {
  /**
   * 유저 PK
   * @example uuid
   */
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "pk_idx_user_id",
  })
  @IsUUID()
  id: string;

  /**
   * 유저 이름
   * @example 'd_o0o_b'
   */
  @Column("varchar", {
    length: 10,
  })
  @IsString()
  @Length(1, 10)
  name: string;

  /**
   * 유저 이메일
   * @example 'd_o0o_b.dev@gmail.com'
   */
  @Column("varchar", {
    length: 255,
    unique: true,
  })
  @IsString()
  @Length(1, 255)
  email: string;

  /**
   * 이메일 전송 여부
   * @example true
   */
  @Column("boolean", {
    default: true,
    name: "email_active",
  })
  @IsBoolean()
  emailActive: boolean;

  /**
   * 유저 프로필 이미지
   */
  @Column({
    type: "text",
  })
  @IsString()
  profile: string;

  /* 유저 소셜 정보 */
  @OneToOne(() => AuthSocial, (userSocial) => userSocial.user, {
    cascade: ["insert"],
  })
  social: AuthSocial;

  /* 유저 RT */
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: ["insert"],
  })
  refreshTokenList: RefreshToken[];

  /* 유저 폴더 */
  @OneToMany(() => Folder, (folder) => folder.user)
  folderList: Folder[];

  @OneToMany(() => Card, (card) => card.user)
  cardList: Card[];
}
