import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { SpecialtiesEntity } from "../../database/entities/Specialties.entity";

export const courses = async (ctx: Context, user: null, idStr: string): Promise<void> => {
    const specialityID = parseInt(idStr);
    if(isNaN(specialityID)) return;

    const speciality = await getRepository(SpecialtiesEntity).findOne({ID: specialityID});
    if(!speciality) return;
    var jsonArr = [];
    jsonArr.push(
        [{
            // @ts-ignore
            text: `1 курс`,
            // @ts-ignore
            callback_data: `/speciality ${speciality.ID}  1`
        }, {
            // @ts-ignore
            text: `2 курс`,
            // @ts-ignore
            callback_data: `/speciality ${speciality.ID} 2`
        }],
        [{
            // @ts-ignore
            text: `3 курс`,
            // @ts-ignore
            callback_data: `/speciality ${speciality.ID} 3`
        },
        {
            // @ts-ignore
            text: `4 курс`,
            // @ts-ignore
            callback_data: `/speciality ${speciality.ID} 4`
        }],
        [{
            // @ts-ignore
            text: `⬅В главное меню`,
            // @ts-ignore
            callback_data: `/start`
        }],
    );

  await ctx.reply( `Вы выбали специальность ${speciality.Name}\nПожалуйста, выберите курс`
  ,{
      reply_markup: {
        inline_keyboard: jsonArr
      }
    });
};