import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('organization')
export class OrganizationEntity {
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
    name: 'name',
  })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.organizations)
  users: UserEntity[];
}
