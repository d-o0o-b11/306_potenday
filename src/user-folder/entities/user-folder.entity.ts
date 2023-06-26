import { KakaoUserInfoEntity } from "src/kakao-userinfo/entities/kakao-userinfo.entity";
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
export class UserFolder {
  @PrimaryColumn("bigint")
  @Generated()
  id: number;

  @Column({ type: "varchar", length: 225 })
  folder_name: string;

  @Column({ type: "int8" })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => KakaoUserInfoEntity, (user) => user.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: KakaoUserInfoEntity;
}
