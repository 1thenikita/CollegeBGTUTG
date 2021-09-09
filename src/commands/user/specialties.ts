import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { SpecialtiesEntity } from "../../database/entities/Specialties.entity";

export const specialties = async (ctx: Context, _user: null): Promise<void> => {
    const specialties = await getRepository(SpecialtiesEntity).find()
    var jsonArr = [];
    for (var i = 0; i < specialties.length; i++) {
        jsonArr.push(
            [{
                // @ts-ignore
                text: specialties[i].Name,
                // @ts-ignore
                callback_data: `/courses ${specialties[i].ID}`
            }],
        );
        if(i === (specialties.length-1)){
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

  await ctx.reply( `Пожалуйста, выберите свою специальность`
  ,{
      reply_markup: {
        inline_keyboard: jsonArr
      }
    });
};