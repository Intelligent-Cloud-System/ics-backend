import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';

@Entity('file_link')
export class FileLinkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: true,
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    name: 'expires_at',
    type: 'date',
  })
  expiresAt: Date;

  @Column({
    type: 'number',
    nullable: false,
    name: 'file_id',
  })
  fileId: number;

  @ManyToOne(() => FileEntity, (file) => file.file_links)
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;

  @Column({
    type: 'number',
    nullable: false,
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.file_links)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
