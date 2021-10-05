import {
  Entity,
  Column,
  PrimaryColumn,
  getRepository, JoinColumn, ManyToOne, OneToMany,
} from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { GroupsEntity } from "./Groups.entity";
import {RolesEntity} from "./Roles.entity";
import {TeachersEntity} from "./Teachers.entity";

@Entity('Users')
export class UsersEntity {
  @PrimaryColumn('int')
  ID!: number;

  @JoinColumn({ name: 'GroupID'})
  @ManyToOne(() => GroupsEntity, (group) => group.Members)
  Group!: GroupsEntity;

  @JoinColumn({ name: 'RoleID'})
  @ManyToOne(() => RolesEntity, (role) => role.Users)
  Role!: RolesEntity | number;

  @Column('varchar', { default: null })
  Name!: string;

  @Column('bit', { default: true })
  NotificationStatus!: boolean;

  @OneToMany(() => TeachersEntity, (teacher) => teacher.User)
  Teachers!: TeachersEntity[];

  save(): Promise<UsersEntity> {
    return getRepository(UsersEntity).save(this);
  }

  delete(): Promise<DeleteResult> {
    return getRepository(UsersEntity).delete(this.ID);
  }

  static async getOrCreateUser<T extends boolean>(
    userID: string,
  ): Promise<UsersEntity> {
    const repository = getRepository(UsersEntity);
    const user = await (repository.findOne(userID, { relations: ["Group", "Role"] }));

    if (user) return user;

    // @ts-ignore
    const newUser = repository.create({
      ID: userID,
      Role: 1, // Роль студента по умолчанию
    });

    // @ts-ignore
    return (repository.save(newUser));
  }
}
