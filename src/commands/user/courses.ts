import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { SpecialtiesEntity } from "../../database/entities/Specialties.entity";
import { SendReplyData } from "../../../types";
import { sendOrEditMessage } from "../../messages";

export const courses = async (ctx: Context, user: null, idStr: string): Promise<void> => {
    const specialityID = parseInt(idStr);
    if(isNaN(specialityID)) return;

    const speciality = await getRepository(SpecialtiesEntity).findOne({ID: specialityID});
    if(!speciality) return;
    var replyArr : SendReplyData[][] = [];
    replyArr.push(
        [ {  text: `1 курс`, callback_data: `/speciality ${speciality.ID} 1` },
            { text: `2 курс`, callback_data: `/speciality ${speciality.ID} 2` }],
        [{ text: `3 курс`, callback_data: `/speciality ${speciality.ID} 3`},
         { text: `4 курс`, callback_data: `/speciality ${speciality.ID} 4`}],
        [{ text: `⬅В главное меню`,callback_data: `/start` }],
    );

    await sendOrEditMessage(ctx, `Вы выбрали специальность ${speciality.Name}\nПожалуйста, выберите курс`
  ,{
      reply_markup: {
        inline_keyboard: replyArr
      }
    });
};