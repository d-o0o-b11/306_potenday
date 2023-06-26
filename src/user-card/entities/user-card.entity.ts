import { KakaoUserInfoEntity } from "src/kakao-userinfo/entities/kakao-userinfo.entity";
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

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "bool", default: false })
  finish_active: boolean;

  @Column({ type: "timestamptz", nullable: true })
  finish_day: Date;

  @ManyToOne(() => UserFolderEntity, (folder) => folder.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "default_folder_id" })
  default_folder_id: UserFolderEntity;

  @ManyToOne(() => KakaoUserInfoEntity, (user) => user.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user_id: KakaoUserInfoEntity;
}
