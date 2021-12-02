import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: true,
  })
  cteatedAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'file_path',
  })
  filePath: string;

  @Column({
    type: 'bigint',
    nullable: false,
    name: 'file_size',
  })
  fileSize: BigInt;

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;
}
