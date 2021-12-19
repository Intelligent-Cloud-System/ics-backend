import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { FileLinkEntity } from './file_link.entity';

@Entity('file')
@Unique(['filePath', 'userId'])
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: true,
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'file_path',
  })
  filePath: string;

  @Column({
    type: 'bigint',
    nullable: false,
    name: 'file_size',
  })
  fileSize: number;

  @Column({
    type: 'number',
    nullable: false,
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => FileLinkEntity, (link) => link.file)
  file_links: FileLinkEntity[];
}
