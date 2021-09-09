import { Context } from "telegraf";

export const start = async (ctx: Context, _user: null): Promise<void> => {
  await ctx.reply( `Привет!\nДобро пожаловать к боту Политехнического колледжа БГТУ
  \nЗдесь Вы можете узнавать о выставленных заменах, а позже и другую важную информацию.
  \nПожалуйста, выберите пункт меню`,{
    reply_markup: {
      inline_keyboard: [
        [
            { text:"Выбрать группу", callback_data: "/specialties"}],
        [   { text:"Просмотр замен на сегодня", callback_data: "/replacements"}]
      ]
    }
  });
};