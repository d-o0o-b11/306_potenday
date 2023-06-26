import { KakaoUserInfoEntity } from "src/kakao-userinfo/entities/kakao-userinfo.entity";
import { DefaultFolderEntity } from "src/user-folder/entities/default-folder.entity";
import { UserFolderEntity } from "src/user-folder/entities/user-folder.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

@Entity("user_card")
export class UserCardEntity {
  @PrimaryColumn("bigint")
  @Generated()
  id: number;

  @Column({ type: "int8", nullable: false })
  top: number;

  @Column({ type: "int8", nullable: false })
  left: number;

  @Column({ type: "varchar", length: 225 })
  title: string;

  @Column({ type: "varchar", length: 225 })
  context: string;

  @Column({ type: "int8", nullable: true })
  default_folder_id: number;

  @Column({ type: "int8", nullable: true })
  user_folder_id: number;

  @Column({ type: "int8", nullable: false })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "bool", default: false })
  finish_active: boolean;

  @Column({ type: "timestamptz", nullable: true })
  finish_day: Date;

  /**
   * 기본 제공하는 폴더는 절대 삭제될 일 없음
   */
  @ManyToOne(() => DefaultFolderEntity, (folder) => folder.id, {
    nullable: true,
    // onDelete: "CASCADE",
  })
  @JoinColumn({ name: "default_folder_id" })
  default_folder: DefaultFolderEntity;

  @ManyToOne(() => KakaoUserInfoEntity, (user) => user.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: KakaoUserInfoEntity;

  /**
   * 추가하는 폴더는 삭제 될 수 있어서 이에 해당하는 카드는 연쇄적으로 삭제되야 함
   */
  @ManyToOne(() => UserFolderEntity, (folder) => folder.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_folder_id" })
  user_folder: UserFolderEntity;

  constructor(data: Partial<UserCardEntity>) {
    Object.assign(this, data);
  }
}
