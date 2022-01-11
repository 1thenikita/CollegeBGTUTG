import { Context } from "telegraf";
import { UsersEntity } from "../../database/entities/Users.entity";
import moment from "moment";
import { sendOrEditMessage } from "../../messages";

export const schedules = async (ctx: Context, user: UsersEntity, dateFutureStr: string): Promise<void> => {
    const GroupName = user.Group ? user.Group.Name : "Не выбрана!";
    if(!user.Group) throw `У вас не выбрана группа! Выберите группу!`;
    const dateFuture = isNaN(parseInt(dateFutureStr)) ? 0 : parseInt(dateFutureStr);
    const schedules = await user.Group.getSchedules(dateFuture);

    let text = schedules.map(
            (schedule) =>
                `<b>${schedule.Pair} пара: ${schedule.Subject.Name}</b>\nПреподаватель: ${schedule.Teacher.Name}\nКабинет: ${schedule.Cabinet}`)
        .join('\n');

    if(!text) text = "Расписание на этот день отсутствует";

    await sendOrEditMessage(ctx, `Ваша группа: ${GroupName}\n\nРасписание на ${moment().add(dateFuture, "d").locale('ru').format('DD MMMM')}: \n${text}\n\n`,{
        reply_markup: {
            inline_keyboard: [
                [ { text: "⬅", callback_data: `/schedules ${dateFuture-1}`}, { text: "Замена", callback_data: `/replacements ${dateFuture}`}, {text: '➡', callback_data: `/schedules ${dateFuture+1}`}],
                [ { text: "⬅В главное меню", callback_data: "/start"} ],
            ]
        }, parse_mode: 'HTML'
    });
};