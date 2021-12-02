import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Unique(['user_id, file_path'])
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
    unique: true
  })
  filePath: string;

  @Column({
    type: 'bigint',
    nullable: false,
    name: 'file_size',
  })
  fileSize: BigInt;

  @Column({
    type: 'number',
    nullable: false,
    name: 'user_id'
  })
  userId: number

  @ManyToOne(() => UserEntity, (user) => user.files)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
