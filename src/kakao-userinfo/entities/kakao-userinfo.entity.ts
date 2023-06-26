import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity("kakao_userinfo")
export class KakaoUserInfoEntity {
  @PrimaryColumn("bigint")
  @Generated()
  id: number;

  @Column({ type: "varchar", length: 225 })
  kakao_id: string;

  @Column({ type: "varchar", length: 225 })
  user_name: string;

  @Column({ type: "varchar", length: 225 })
  user_img: string;

  @Column({ type: "varchar", length: 225, nullable: true })
  user_email: string;

  @Column({ type: "varchar", length: 225, nullable: true })
  accesstoken: string;

  @Column({ type: "varchar", length: 225, nullable: true })
  refreshtoken: string;
}
