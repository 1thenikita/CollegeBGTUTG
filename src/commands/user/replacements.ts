import { Context } from "telegraf";
import { UsersEntity } from "../../database/entities/Users.entity";
import moment from "moment";

export const replacements = async (ctx: Context, user: UsersEntity): Promise<void> => {
    const GroupName = user.Group ? user.Group.Name : "Не выбрана!";
    if(!user.Group) throw `У вас не выбрана группа! Выберите группу!`;

    const replacement = await user.Group.getReplacements();

    const text = replacement
        .map(
            (repl) =>
                `Вместо ${repl.InsteadOf} будет ${repl.Replacing} ${repl.Pair} паре в кабинете ${repl.Cabinet}`,
        )
        .join('\n');

    const textMessagee = text === "" ? "Отсутствуют их ещё не добавили" : text;

    await ctx.telegram.sendMessage(user.ID, `Ваша группа: ${GroupName}\n\nЗамены на ${moment().locale('ru').format('DD MMMM')}: \n${textMessagee}`,{
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "⬅В главное меню", callback_data: "/start"}
                ],
            ]
        }
    });
};