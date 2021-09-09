import { Context } from "telegraf";
import { UsersEntity } from "../../database/entities/Users.entity";
import moment from "moment";
import { ReplacementsEntity } from "../../database/entities/Replacements.entity";

export const replacements = async (ctx: Context, user: UsersEntity): Promise<void> => {
    const GroupName = user.Group ? user.Group.Name : "Не выбрана!";
    if(!user.Group) throw `У вас не выбрана группа! Выберите группу!`;

    const GroupText = user.Group ? "" : "⚠Для получения важной информации рекомендуем выбрать группу.";

    const replacement = user.Group ? await user.Group.getReplacements(0) : await ReplacementsEntity.getReplacements(0);
    const text = replacement
        .map(
            (repl) =>
                `Вместо ${repl.InsteadOf} будет ${repl.Replacing} на ${repl.Pair} паре в кабинете ${repl.Cabinet}`,
        )
        .join('\n');

    const replacementAddDay = user.Group ? await user.Group.getReplacements(1) : await ReplacementsEntity.getReplacements(1);
    const textAddDay  = replacementAddDay
        .map(
            (repl) =>
                `Вместо  ${repl.InsteadOf} будет ${repl.Replacing} на ${repl.Pair} паре в кабинете ${repl.Cabinet}`,
        )
        .join('\n');

    const textMessage = text === "" ? "Отсутствуют их ещё не добавили" : text;
    const textMessageAddDay  = textAddDay  === "" ? "Отсутствуют их ещё не добавили" : textAddDay;

    await ctx.telegram.sendMessage(user.ID, `Ваша группа: ${GroupName}\n\nЗамены на ${moment().locale('ru').format('DD MMMM')}: \n${textMessage}\n\nЗамены на ${moment().add(1, 'd').locale('ru').format('DD MMMM')}: \n${textMessageAddDay}\n\n${GroupText}`,{
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "⬅В главное меню", callback_data: "/start"}
                ],
            ]
        }
    });
};