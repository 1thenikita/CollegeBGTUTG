import {
  Entity,
  Column,
  getRepository, PrimaryGeneratedColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import {GroupsEntity} from "./Groups.entity"
import moment from "moment";

@Entity('Replacements')
export class ReplacementsEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @JoinColumn({ name: 'GroupID'})
  @ManyToOne(() => GroupsEntity, (group) => group.Replacements)
  Group!: GroupsEntity;

  @Column('int', { default: null })
  Pair!: string;

  @Column('varchar', { length: 100 })
  InsteadOf!: string;

  @Column('varchar', { length: 100 })
  Replacing!: string;

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
