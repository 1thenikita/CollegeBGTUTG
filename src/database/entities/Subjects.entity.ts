import {
  Entity,
  Column,
  getRepository, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {ReplacementsEntity} from "./Replacements.entity";

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

  save(): Promise<SubjectsEntity> {
    return getRepository(SubjectsEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(SubjectsEntity).delete(this.ID);
  }
}
