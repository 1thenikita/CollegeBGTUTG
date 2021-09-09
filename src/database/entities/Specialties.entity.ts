import {
  Entity,
  Column,
  getRepository, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {GroupsEntity} from "./Groups.entity";

@Entity('Specialties')
export class SpecialtiesEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column('varchar', { length: 100 })
  Name!: string;

  @Column('int')
  MaxCourse!: number;

  @OneToMany(() => GroupsEntity, (group) => group.Speciality)
  Groups!: GroupsEntity | undefined;

  save(): Promise<SpecialtiesEntity> {
    return getRepository(SpecialtiesEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(SpecialtiesEntity).delete(this.ID);
  }

  public async getGroups(): Promise<GroupsEntity[]> {
    return getRepository(GroupsEntity).find({ where: { Speciality: this.ID } });
  }
}
