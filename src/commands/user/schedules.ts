import { Context } from "telegraf";
import { UsersEntity } from "../../database/entities/Users.entity";
import moment from "moment";

export const schedules = async (ctx: Context, user: UsersEntity): Promise<void> => {
    const GroupName = user.Group ? user.Group.Name : "Не выбрана!";
    if(!user.Group) throw `У вас не выбрана группа! Выберите группу!`;

    const schedules = await user.Group.getSchedules(0);

    let text = schedules.map(
            (schedule) =>
                `На <b>${schedule.Pair} паре</b> будет предмет <b>${schedule.Subject.Name}</b> у преподавателя ${schedule.Teacher.Name} в кабинете ${schedule.Cabinet}`)
        .join('\n');

    if(!text)

    await ctx.telegram.sendMessage(user.ID, `Ваша группа: ${GroupName}\n\nРасписание предметов на ${moment().locale('ru').format('DD MMMM')}: \n${text}\n\n`,{
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "⬅В главное меню", callback_data: "/start"}
                ],
            ]
        }, parse_mode: 'HTML'
    });
};