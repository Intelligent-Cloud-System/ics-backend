import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';

export enum UserRole {
  User = 'User',
  OrganizationAdmin = 'OrganizationAdmin',
}

@Entity('users')
export class UserEntity {
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
    name: 'first_name',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}
