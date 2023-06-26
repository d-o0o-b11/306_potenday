import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

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

  constructor(data: Partial<DefaultFolderEntity>) {
    Object.assign(this, data);
  }
}
