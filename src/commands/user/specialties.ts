import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { SpecialtiesEntity } from "../../database/entities/Specialties.entity";
import { sendOrEditMessage } from "../../messages";
import { SendReplyData } from "../../../types";

export const specialties = async (ctx: Context, _user: null): Promise<void> => {
    const specialties = await getRepository(SpecialtiesEntity).find()

    const replyArr: SendReplyData[][] = specialties.map((s) => [
        { text: s.Name, callback_data: `/courses ${s.ID}` },
    ]);
    replyArr.push([{ text: `⬅В главное меню`, callback_data: `/start` }]);

    await sendOrEditMessage(ctx, `Пожалуйста, выберите свою специальность`,{
      reply_markup: {
        inline_keyboard: replyArr
      }
    });
};