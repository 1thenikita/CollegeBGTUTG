import { Context } from "telegraf";
import { UsersEntity } from '../../database/entities/Users.entity';
import { getRepository } from "typeorm";
import { GroupsEntity } from "../../database/entities/Groups.entity";
import { sendOrEditMessage } from "../../messages";

export const setgroup = async (ctx: Context, user: UsersEntity, idStr: string): Promise<void> => {

  const groupID = parseInt(idStr);

  if(isNaN(groupID)) return;

  const group = await getRepository(GroupsEntity).findOne({ID: groupID});
  if(!group) return;

  user.Group = group;
  await user.save();

  await sendOrEditMessage(ctx, `Вы изменили параметр\nВаша группа: ${group.Name}`,{
    reply_markup: {
      inline_keyboard: [
        [ { text: "🚪Информация о профиле", callback_data: "/info" }],
        [ { text: "⬅В главное меню", callback_data: "/start" }],
      ]
    }
  });
};

