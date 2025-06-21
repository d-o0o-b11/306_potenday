import { IsDate, IsString, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { UUID } from "src/common";

@Entity({
  schema: "auth",
  name: "refresh_token",
})
export class RefreshToken {
  /**
   * RT PK
   * @example uuid
   */
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    primaryKeyConstraintName: "pk_idx_refresh_token_id",
  })
  @IsUUID()
  id: string;

  /**
   * 유저 FK
   * @example uuid
   */
  @Index("idx_auth_refresh_token_user_id")
  @Column({
    name: "user_id",
    type: "uuid",
  })
  @IsUUID()
  userId: UUID;

  /**
   * RT 토큰
   * @example token
   */
  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  @IsString()
  token: string;

  /**
   * RT 세션 ID
   * @example uuid
   */
  @Column({
    name: "session_id",
    type: "uuid",
    unique: true,
  })
  @IsUUID()
  sessionId: UUID;

  /**
   * RT 만료일
   * @example 2025-06-20T00:00:00Z
   */
  @Column({
    type: "timestamptz",
    name: "expired_at",
  })
  @IsDate()
  expiredAt: Date;

  /**
   * 유저 정보
   */
  @ManyToOne(() => User, (user) => user.refreshTokenList, {
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
