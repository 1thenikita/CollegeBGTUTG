import {
  Entity,
  Column,
  getRepository,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UsersEntity } from "./Users.entity";
import { SpecialtiesEntity } from "./Specialties.entity";
import { ReplacementsEntity } from "./Replacements.entity";
import moment from 'moment';
import { SchedulesEntity } from "./Schedules.entity";

@Entity('Groups')
export class GroupsEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column('varchar', { length: 50 })
  Name!: string;

  @JoinColumn({ name: 'SpecialityID'})
  @ManyToOne(() => SpecialtiesEntity, (speciality) => speciality.Groups)
  Speciality!: SpecialtiesEntity;

  @Column('int', { default: null })
  ManagerID!: string;

  @Column('text', { default: null })
  Note!: string;

  @Column('bit', { default: false })
  Paid!: boolean;

  @Column('int', { default: false })
  Course!: number;

  @OneToMany(() => UsersEntity, (user) => user.Group)
  Members!: UsersEntity[];

  @OneToMany(() => ReplacementsEntity, (replacement) => replacement.Group)
  Replacements!: ReplacementsEntity[];

  @OneToMany(() => SchedulesEntity, (schedule) => schedule.Group)
  Schedules!: SchedulesEntity[];

  save(): Promise<GroupsEntity> {
    return getRepository(GroupsEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(GroupsEntity).delete(this.ID);
  }

  public async getMembers(Notification: boolean): Promise<UsersEntity[]> {
    return getRepository(UsersEntity).find({ where: { Group: this.ID, NotificationStatus: Notification } });
  }

  public async getSchedules(dateFuture: number | null): Promise<SchedulesEntity[]> {
    const date = moment().add(dateFuture, "d");
    const repository = getRepository(SchedulesEntity);
    const currentWeek = date.isoWeek() % 2 == 0 ? 1: 2;

    const schedulesMain = await repository.find({ relations: ["Group", "Teacher", "Subject"], where: { Group: this.ID, Weekday: date.weekday(), DateEnd: MoreThanOrEqual(date.toISOString()), DateStart: LessThanOrEqual(date.toISOString()), TypeOfWeek: 0} })
    const schedulesTypeOfWeek = await repository.find({ relations: ["Group", "Teacher", "Subject"], where: { Group: this.ID, Weekday: date.weekday(), DateEnd: MoreThanOrEqual(date.toISOString()), DateStart: LessThanOrEqual(date.toISOString()), TypeOfWeek: currentWeek} })

    return [...schedulesMain, ...schedulesTypeOfWeek].sort((a, b) => a.Pair - b.Pair);
  }

  public async getReplacements(dateFuture: number | null): Promise<ReplacementsEntity[]> {
    const date = moment();
    date.add(dateFuture, "d");

    return getRepository(ReplacementsEntity).find({ relations: ['InsteadOfTeacher','InsteadOfSubject','ReplacingTeacher','ReplacingSubject'], where: { Group: this.ID, Date: dateFuture ? date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD') } });
  }
}
