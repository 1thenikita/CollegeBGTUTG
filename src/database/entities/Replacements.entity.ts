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

  @ManyToOne(() => TeachersEntity, (teacher) => teacher.ReplacementsInsteadOf)
  @JoinColumn({ name: 'InsteadOfTeacherID'})
  InsteadOfTeacher!: TeachersEntity;

  @ManyToOne(() => SubjectsEntity, (subject) => subject.ReplacementsInsteadOf)
  @JoinColumn({ name: 'InsteadOfSubjectID'})
  InsteadOfSubject!: TeachersEntity;

  @ManyToOne(() => TeachersEntity, (teacher) => teacher.ReplacementsReplacing)
  @JoinColumn({ name: 'ReplacingTeacherID'})
  ReplacingTeacher!: TeachersEntity;

  @ManyToOne(() => SubjectsEntity, (subject) => subject.ReplacementsReplacing)
  @JoinColumn({ name: 'ReplacingSubjectID'})
  ReplacingSubject!: TeachersEntity;

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

    return getRepository(ReplacementsEntity).find({ where: { Date: date.format('YYYY-MM-DD') } });
  }
}
