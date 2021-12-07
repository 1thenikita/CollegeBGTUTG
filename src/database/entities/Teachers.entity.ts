import {
  Entity,
  Column,
  getRepository, OneToMany, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {UsersEntity} from "./Users.entity";
import {ReplacementsEntity} from "./Replacements.entity";
import {SchedulesEntity} from "./Schedules.entity";

@Entity('Teachers')
export class TeachersEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column('varchar', { default: null })
  Name!: string;

  @JoinColumn({name: 'UserID'})
  @ManyToOne(() => UsersEntity, (user) => user.Teachers)
  User: UsersEntity;

  @Column('varchar', { length: 100, default: null })
  Subject!: string;

  @OneToMany(() => ReplacementsEntity, (replacement) => replacement.InsteadOfTeacher)
  ReplacementsInsteadOf!: ReplacementsEntity[];

  @OneToMany(() => ReplacementsEntity, (replacement) => replacement.ReplacingTeacher)
  ReplacementsReplacing!: ReplacementsEntity[];

  @OneToMany(() => SchedulesEntity, (schedule) => schedule.Teacher)
  Schedules!: SchedulesEntity[];

  save(): Promise<TeachersEntity> {
    return getRepository(TeachersEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(TeachersEntity).delete(this.ID);
  }
}
