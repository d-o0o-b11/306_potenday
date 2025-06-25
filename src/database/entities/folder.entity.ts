import { IsString, IsUUID, Length } from "class-validator";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Card } from "./card.entity";

@Entity("folder")
export class Folder extends BaseEntity {
  /**
   * 유저 폴더 PK
   * @example uuid
   */
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "pk_idx_user_folder_id",
  })
  @IsUUID()
  id: string;

  /**
   * 유저 폴더 이름
   * @example '개인 프로젝트'
   */
  @Column({
    type: "varchar",
    length: 20,
  })
  @IsString()
  @Length(1, 20)
  name: string;

  /**
   * 유저 폴더의 가로 축
   * @example '시급도'
   */
  @Column({
    type: "varchar",
    length: 10,
    name: "width_name",
  })
  @IsString()
  @Length(1, 10)
  widthName: string;

  /**
   * 유저 폴더의 세로 축
   * @example '중요도'
   */
  @Column({
    type: "varchar",
    length: 10,
    name: "height_name",
  })
  @IsString()
  @Length(1, 10)
  heightName: string;

  /**
   * 유저 ID
   * @example uuid
   */
  @Index("idx_folder_user_id")
  @Column({
    type: "uuid",
    name: "user_id",
  })
  @IsUUID()
  userId: string;

  /** 유저 */
  @ManyToOne(() => User, (user) => user.folderList, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  /** 유저 카드 */
  @OneToMany(() => Card, (card) => card.folder)
  cardList: Card[];
}
