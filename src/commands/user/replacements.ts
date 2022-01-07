import { Context } from "telegraf";
import { UsersEntity } from "../../database/entities/Users.entity";
import moment from "moment";
import { ReplacementsEntity } from "../../database/entities/Replacements.entity";
import { sendOrEditMessage } from "../../messages";

export const replacements = async (ctx: Context, user: UsersEntity, dateFutureStr: string): Promise<void> => {
    const GroupName = user.Group ? user.Group.Name : "Не выбрана!";
    if(!user.Group) throw `У вас не выбрана группа! Выберите группу!`;
    const dateFuture = isNaN(parseInt(dateFutureStr)) ? 0 : parseInt(dateFutureStr);

    // const GroupText = user.Group ? "" : "⚠Для получения важной информации рекомендуем выбрать группу.";

    const replacement = user.Group ? await user.Group.getReplacements(0) : await ReplacementsEntity.getReplacements(dateFuture);
    const text = replacement
        .map(
            (repl) =>
                `Вместо предмета <b>${repl.InsteadOfSubject.Name} (${repl.InsteadOfTeacher.Name})</b> будет предмет <b>${repl.ReplacingSubject.Name} (${repl.ReplacingTeacher.Name})</b> на ${repl.Pair} паре в кабинете ${repl.Cabinet}`
        )
        .join('\n');

    const textMessage = text === "" ? "Отсутствуют их ещё не добавили" : text;

    await sendOrEditMessage(ctx, `Ваша группа: ${GroupName}\n\nЗамены на ${moment().add(dateFuture, 'd').locale('ru').format('DD MMMM')}: \n${textMessage}`,{
        reply_markup: {
            inline_keyboard: [
                [ { text: "⬅", callback_data: `/replacements ${dateFuture-1}`}, { text: "Расписание", callback_data: `/schedules ${dateFuture}`}, {text: '➡', callback_data: `/replacements ${dateFuture+1}`}],
                [ { text: "⬅В главное меню", callback_data: "/start"} ],
            ]
        }, parse_mode: 'HTML'
    });
};