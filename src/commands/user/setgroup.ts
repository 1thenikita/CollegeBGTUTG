import { Context } from "telegraf";
import { UsersEntity } from '../../database/entities/Users.entity';
import { getRepository } from "typeorm";
import { GroupsEntity } from "../../database/entities/Groups.entity";

export const setgroup = async (ctx: Context, user: UsersEntity, idStr: string): Promise<void> => {

  const groupID = parseInt(idStr);

  if(isNaN(groupID)) return;

  const group = await getRepository(GroupsEntity).findOne({ID: groupID});
  if(!group) return;

  user.Group = group;
  await user.save();

  await ctx.telegram.sendMessage(user.ID, `Вы изменили параметр\nВаша группа: ${group.Name}`);
};

