import { Context } from "telegraf";
import { UsersEntity } from '../../database/entities/Users.entity';
import { sendOrEditMessage } from "../../messages";

export const notification = async (ctx: Context, user: UsersEntity): Promise<void> => {
  user.NotificationStatus = !user.NotificationStatus;
  await user.save();


  const NotificationStatus = user.NotificationStatus ? "✅Включены" : "❌Выключены";
  const MotivationText = user.NotificationStatus ? "" : "⚠Для получения важной информации рекомендуем включить уведомления.";

  await sendOrEditMessage(ctx, `Вы изменили параметр\nУведомления: ${NotificationStatus}\n\n${MotivationText}`,{
    reply_markup: {
      inline_keyboard: [
        [ { text: "🚪Информация о профиле", callback_data: "/info"}],
        [ { text: "⬅В главное меню", callback_data: "/start"} ]]
    }
  });
};

