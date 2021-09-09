import {
  Entity,
  Column,
  getRepository, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {UsersEntity} from "./Users.entity";

@Entity('Roles')
export class RolesEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column('varchar', { length: 50 })
  Name!: string;

  @OneToMany(() => UsersEntity, (user) => user.Role)
  Users!: UsersEntity[];

  save(): Promise<RolesEntity> {
    return getRepository(RolesEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(RolesEntity).delete(this.ID);
  }

  public async getMembers(): Promise<UsersEntity[]> {
    return getRepository(UsersEntity).find({ where: { Role: this.ID} });
  }
}
