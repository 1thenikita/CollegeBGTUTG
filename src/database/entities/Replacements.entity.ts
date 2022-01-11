import {
  Entity,
  Column,
  getRepository, PrimaryGeneratedColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {GroupsEntity} from "./Groups.entity"
import moment from "moment";
import { TeachersEntity } from "./Teachers.entity";
import { SubjectsEntity } from "./Subjects.entity";

@Entity('Replacements')
export class ReplacementsEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @JoinColumn({ name: 'GroupID'})
  @ManyToOne(() => GroupsEntity, (group) => group.Replacements)
  Group!: GroupsEntity;

  @Column('int', { default: null })
  Pair!: string;

  @JoinColumn({ name: 'InsteadOfTeacherID'})
  @ManyToOne(() => TeachersEntity, (teacher) => teacher.ReplacementsInsteadOf)
  InsteadOfTeacher!: TeachersEntity;

  @JoinColumn({ name: 'InsteadOfSubjectID'})
  @ManyToOne(() => SubjectsEntity, (subject) => subject.ReplacementsInsteadOf)
  InsteadOfSubject!: SubjectsEntity;

  @JoinColumn({ name: 'ReplacingTeacherID'})
  @ManyToOne(() => TeachersEntity, (teacher) => teacher.ReplacementsReplacing)
  ReplacingTeacher!: TeachersEntity;

  @JoinColumn({ name: 'ReplacingSubjectID'})
  @ManyToOne(() => SubjectsEntity, (subject) => subject.ReplacementsReplacing)
  ReplacingSubject!: SubjectsEntity;

  @Column('varchar', { length: 50 })
  Cabinet!: string;

  @Column('date')
  Date!: Date;

  @Column('bit')
  Status: boolean;

  save(): Promise<ReplacementsEntity> {
    return getRepository(ReplacementsEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(ReplacementsEntity).delete(this.ID);
  }

  public static async getReplacements(dateFuture: number): Promise<ReplacementsEntity[]> {
    const date = moment().add(dateFuture, "d");

    return getRepository(ReplacementsEntity).find({ relations: ['Group'], where: { Date: date.format('YYYY-MM-DD') } });
  }
}
