import { IsBoolean, IsNumber, IsString, IsUUID, Length } from "class-validator";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Folder } from "./folder.entity";

@Entity("card")
export class Card extends BaseEntity {
  /**
   * 카드 PK
   * @example uuid
   */
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "pk_idx_user_card_id",
  })
  @IsUUID()
  id: string;

  /**
   * 제목
   * @example '306 프로젝트'
   */
  @Column({
    type: "varchar",
    length: 20,
  })
  @IsString()
  @Length(1, 20)
  title: string;

  /**
   * 내용
   * @example '306 프로젝트 리팩토링'
   */
  @Column({
    type: "varchar",
    length: 100,
  })
  @IsString()
  @Length(1, 100)
  context: string;

  /**
   * 세로 축 위치
   * @example 100
   */
  @Column({
    type: "int8",
    nullable: false,
  })
  @IsNumber()
  top: number;

  /**
   * 가로 축 위치
   * @example 100
   */
  @Column({
    type: "int8",
    nullable: false,
  })
  @IsNumber()
  left: number;

  /**
   * 폴더 ID FK
   * @example uuid
   */
  @Column({
    type: "uuid",
    name: "folder_id",
  })
  @IsUUID()
  folderId: string;

  /**
   * 유저 ID FK
   * @example uuid
   */
  @Index("idx_card_user_id")
  @Column({
    type: "uuid",
    nullable: false,
    name: "user_id",
  })
  @IsUUID()
  userId: string;

  /**
   * 유저 카드 상태
   * @description true: 완료, false: 진행 중
   * @example true
   */
  @Column({
    type: "bool",
    default: false,
  })
  @IsBoolean()
  status: boolean;

  /**
   * 카드 완료 날짜
   * @example '2025-06-20T00:00:00Z'
   */
  @Column({
    type: "timestamptz",
    name: "finish_date",
  })
  finishDate: Date;

  /**
   * 유저 카드 폴더 접은 상태
   * @description true: 접힘, false: 펼쳐짐
   * @example true
   */
  @Column({
    type: "bool",
    default: false,
    name: "folded_state",
  })
  @IsBoolean()
  foldedState: boolean;

  /** 유저 */
  @ManyToOne(() => User, (user) => user.cardList, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.cardList, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "folder_id" })
  folder: Folder;
}
