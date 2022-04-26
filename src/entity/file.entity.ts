import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('file')
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
    name: 'key',
    unique: true,
  })
  key: string;

  @Column({
    type: 'number',
    nullable: false,
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
