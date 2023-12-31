import { IsNumber, IsString } from 'class-validator';
import { UserFolderEntity } from 'src/user-folder/entities/user-folder.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('kakao_userinfo')
export class KakaoUserInfoEntity {
  @PrimaryColumn('bigint')
  @Generated()
  @IsNumber()
  id: number;

  @Column({ type: 'varchar', length: 225 })
  @IsString()
  kakao_id: string;

  @Column({ type: 'varchar', length: 225 })
  @IsString()
  user_name: string;

  @Column({ type: 'varchar', length: 225 })
  @IsString()
  user_img: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  @IsString()
  user_email: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  @IsString()
  accesstoken: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  @IsString()
  refreshtoken: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'boolean', default: true })
  email_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  email_update_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  nickname_update_time: Date;

  @OneToMany(() => UserFolderEntity, (folder) => folder.user, { cascade: true })
  folders: UserFolderEntity[];
}
