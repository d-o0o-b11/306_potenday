import { KakaoUserInfoEntity } from "src/kakao-userinfo/entities/kakao-userinfo.entity";
import { UserCardEntity } from "src/user-card/entities/user-card.entity";
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

@Entity("user_folder")
export class UserFolderEntity {
  @PrimaryColumn("bigint")
  @Generated()
  id: number;

  @Column({ type: "varchar", length: 225 })
  folder_name: string;

  @Column({ type: "int8" })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "varchar", length: 225, nullable: true })
  width: string;

  @Column({ type: "varchar", length: 225, nullable: true })
  height: string;

  @ManyToOne(() => KakaoUserInfoEntity, (user) => user.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: KakaoUserInfoEntity;

  @OneToMany(() => UserCardEntity, (card) => card.id, { cascade: true })
  cards: UserCardEntity[];

  constructor(data: Partial<UserFolderEntity>) {
    Object.assign(this, data);
  }
}
