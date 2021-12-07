import {
  Entity,
  Column,
  getRepository, PrimaryGeneratedColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import moment from 'moment';
import {GroupsEntity} from "./Groups.entity";
import {SubjectsEntity} from "./Subjects.entity";
import {TeachersEntity} from "./Teachers.entity";

@Entity('Schedules')
export class SchedulesEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @JoinColumn({ name: 'GroupID'})
  @ManyToOne(() => GroupsEntity, (group) => group.Schedules)
  Group!: GroupsEntity;

  @JoinColumn({ name: 'SubjectID'})
  @ManyToOne(() => SubjectsEntity, (subject) => subject.Schedules)
  Subject!: SubjectsEntity;

  @JoinColumn({ name: 'TeacherID'})
  @ManyToOne(() => TeachersEntity, (teacher) => teacher.Schedules)
  Teacher!: TeachersEntity;

  @Column('int')
  Pair!: number;

  @Column('int')
  Weekday!: number;

  @Column('varchar', { length: 50 })
  Cabinet!: string;

  @Column('bit', { default: true })
  IsMain!: boolean;

  @Column('bit', { default: false })
  Fractional!: boolean;

  save(): Promise<SchedulesEntity> {
    return getRepository(SchedulesEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(SchedulesEntity).delete(this.ID);
  }

  public static async getSchedules(dateFuture: number): Promise<SchedulesEntity[]> {
    const date = moment().add(dateFuture, "d");

    return getRepository(SchedulesEntity).find({ relations: ["Group", "Teacher", "Subject"], where: { Date: date.format('YYYY-MM-DD') } });
  }
}
