import { Context} from "telegraf";
import { getRepository } from "typeorm";
import { GroupsEntity } from "../../database/entities/Groups.entity";
import { SpecialtiesEntity } from "../../database/entities/Specialties.entity";
import moment from "moment";

export const speciality = async (ctx: Context, user: null, idStr: string, courseStr: string): Promise<void> => {
    const specialityID = parseInt(idStr);
    const cource = (parseInt(courseStr)-1) * -1 ;

    if(isNaN(specialityID) || isNaN(cource)) return;

    const speciality = await getRepository(SpecialtiesEntity).findOne({ID: specialityID});
    if(!speciality) return;

    const courceYear = moment().add(cource, 'year').format('YY');

    const groups = await getRepository(GroupsEntity).find({Speciality: speciality})
    var jsonArr = [];
    for (var i = 0; i < groups.length; i++) {
        if(groups[i].Name.includes(courceYear))
        {
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
    }

  await ctx.reply( `Пожалуйста, выберите свою группу`
  ,{
      reply_markup: {
        inline_keyboard: jsonArr
      }
    });
};