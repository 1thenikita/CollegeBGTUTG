import { Context} from "telegraf";
import { getRepository } from "typeorm";
import { GroupsEntity } from "../../database/entities/Groups.entity";
import { SpecialtiesEntity } from "../../database/entities/Specialties.entity";
import { SendReplyData } from "../../../types";
import { sendOrEditMessage } from "../../messages";

export const speciality = async (ctx: Context, user: null, idStr: string, courseStr: string): Promise<void> => {
    const specialityID = parseInt(idStr);
    const cource = parseInt(courseStr);

    if(isNaN(specialityID) || isNaN(cource)) return;

    const speciality = await getRepository(SpecialtiesEntity).findOne({ ID: specialityID });
    if(!speciality) return;

    const groups = await getRepository(GroupsEntity).find({Speciality: speciality, Course: cource})

    const replyArr: SendReplyData[][] = groups.map((g) => [
        { text: g.Name, callback_data: `/setgroup ${g.ID}` },
    ]);
    replyArr.push([{ text: `⬅В главное меню`, callback_data: `/start` }]);

    await sendOrEditMessage(ctx, `Пожалуйста, выберите свою группу`,
        {reply_markup: { inline_keyboard: replyArr } });
};