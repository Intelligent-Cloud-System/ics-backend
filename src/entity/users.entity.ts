import { BaseEntity } from "./../base-entity";
import { Column, Entity } from "typeorm";

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string
  
  @Column()
  surname: string

  @Column()
  email: string

  @Column()
  password: string

}