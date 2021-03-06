import { Context } from "telegraf";
import { sendOrEditMessage } from "../../messages";

export const start = async (ctx: Context, _user: null): Promise<void> => {
  await sendOrEditMessage(ctx, `Привет!\nДобро пожаловать к боту Политехнического колледжа БГТУ
  \nЗдесь Вы можете узнавать о выставленных заменах, а позже и другую важную информацию.
  \nПожалуйста, выберите пункт меню`,{
    reply_markup: {
      inline_keyboard: [
        [ { text:"Выбрать группу", callback_data: "/specialties" }],
        [ { text:"🛎Просмотр замен", callback_data: "/replacements" }],
        [ { text:"🛎Просмотр расписания", callback_data: "/schedules "}]

      ]
    }
  });
};