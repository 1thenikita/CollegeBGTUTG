import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { GroupsEntity } from "../../database/entities/Groups.entity";
import { sendOrEditMessage } from "../../messages";
import { SendReplyData } from "../../../types";

export const groups = async (ctx: Context): Promise<void> => {
    const groups = await getRepository(GroupsEntity).find();
    const replyArr: SendReplyData[][] = groups.map((g) => [
        { text: g.Name, callback_data: `/setgroup ${g.ID}` },
    ]);

    replyArr.push([{ text: `⬅В главное меню`, callback_data: `/start` }]);

    await sendOrEditMessage(ctx, `Выберите свою группу`
  ,{
      reply_markup: { inline_keyboard: replyArr }
    });
};