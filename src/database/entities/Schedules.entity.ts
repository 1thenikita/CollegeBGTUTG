import {
  Column,
  Entity,
  getRepository,
  JoinColumn,
  LessThanOrEqual,
  ManyToOne,
  MoreThanOrEqual,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import moment from 'moment';
import { GroupsEntity } from "./Groups.entity";
import { SubjectsEntity } from "./Subjects.entity";
import { TeachersEntity } from "./Teachers.entity";

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

  @Column('int')
  TypeOfWeek!: number;

  @Column('date')
  DateStart!: Date;

  @Column('date')
  DateEnd!: Date;

  save(): Promise<SchedulesEntity> {
    return getRepository(SchedulesEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(SchedulesEntity).delete(this.ID);
  }

  public static async getSchedules(dateFuture: number): Promise<SchedulesEntity[]> {
    const date = moment().add(dateFuture, "d");
    const repository = getRepository(SchedulesEntity);
    const currentWeek = date.isoWeek() % 2 == 0 ? 1: 2;

    const schedulesMain = await repository.find({ relations: ["Group", "Teacher", "Subject"], where: { Weekday: date.weekday(), DateEnd: MoreThanOrEqual(date.toISOString()), DateStart: LessThanOrEqual(date.toISOString()), TypeOfWeek: 0} })
    const schedulesTypeOfWeek = await repository.find({ relations: ["Group", "Teacher", "Subject"], where: { Weekday: date.weekday(), DateEnd: MoreThanOrEqual(date.toISOString()), DateStart: LessThanOrEqual(date.toISOString()), TypeOfWeek: currentWeek} })

    return [...schedulesMain, ...schedulesTypeOfWeek].sort((a, b) => a.Pair - b.Pair);
  }
}
