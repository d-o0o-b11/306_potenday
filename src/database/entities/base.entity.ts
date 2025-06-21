import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
  /**
   * 생성일
   * @example 2025-06-21T12:00:22
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    name: "created_at",
  })
  createdAt!: Date;

  /**
   * 수정일
   * @example 2025-06-21T12:00:22
   */
  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp with time zone",
    default: null,
    nullable: true,
  })
  updatedAt!: Date | null;

  /**
   * 삭제일
   * @example 2025-06-22T12:00:22
   */
  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp with time zone",
    default: null,
    nullable: true,
  })
  deletedAt!: Date | null;
}
