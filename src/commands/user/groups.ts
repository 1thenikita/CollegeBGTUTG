import {Context} from "telegraf";
import {getRepository} from "typeorm";
import { GroupsEntity } from "../../database/entities/Groups.entity";

export const groups = async (ctx: Context): Promise<void> => {
    const groups = await getRepository(GroupsEntity).find()
    var jsonArr = [];
    for (var i = 0; i < groups.length; i++) {
        jsonArr.push(
            [{
                // @ts-ignore
                text: groups[i].Name,
                // @ts-ignore
                callback_data: `/setgroup ${groups[i].ID}`
            }],
        );
        if(i === (groups.length-1)){
            jsonArr.push(
                [{
                    // @ts-ignore
                    text: `⬅В главное меню`,
                    // @ts-ignore
                    callback_data: `/start`
                }],
            );
        }
    }

  await ctx.reply( `Выберите свою группу`
  ,{
      reply_markup: {
        inline_keyboard: jsonArr
      }
    });
};