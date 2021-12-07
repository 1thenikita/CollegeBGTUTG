import {
  Entity,
  Column,
  getRepository, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {ReplacementsEntity} from "./Replacements.entity";
import {SchedulesEntity} from "./Schedules.entity";

@Entity('Subjects')
export class SubjectsEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column('varchar', { default: null })
  Name!: string;

  @OneToMany(() => ReplacementsEntity, (replacement) => replacement.InsteadOfSubject)
  ReplacementsInsteadOf!: ReplacementsEntity[];

  @OneToMany(() => ReplacementsEntity, (replacement) => replacement.ReplacingSubject)
  ReplacementsReplacing!: ReplacementsEntity[];

  @OneToMany(() => SchedulesEntity, (schedule) => schedule.Subject)
  Schedules!: SchedulesEntity[];

  save(): Promise<SubjectsEntity> {
    return getRepository(SubjectsEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(SubjectsEntity).delete(this.ID);
  }
}
