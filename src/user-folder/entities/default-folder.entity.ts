import { UserCardEntity } from "src/user-card/entities/user-card.entity";
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from "typeorm";

@Entity("default_folder")
export class DefaultFolderEntity {
  @PrimaryColumn("bigint")
  id: number;

  @Column({ type: "varchar", length: 225 })
  folder_name: string;

  @Column({ type: "varchar", length: 225 })
  width: string;

  @Column({ type: "varchar", length: 225 })
  height: string;

  /**
   * 기본 제공하는 폴더는 절대 삭제될 일 없음
   */
  @OneToMany(() => UserCardEntity, (card) => card.id)
  cards: UserCardEntity[];

  constructor(data: Partial<DefaultFolderEntity>) {
    Object.assign(this, data);
  }
}
