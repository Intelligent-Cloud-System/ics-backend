import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FileEntity } from './file.entity';
import { OrganizationEntity } from './organization.entity';

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
    name: 'created_at',
  })
  createdAt: Date;

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

  @ManyToMany(() => OrganizationEntity, (organization) => organization.users)
  organizations: OrganizationEntity[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}
