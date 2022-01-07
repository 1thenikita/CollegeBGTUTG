import { Context } from "telegraf";
import { UsersEntity } from '../../database/entities/Users.entity';
import { sendOrEditMessage } from "../../messages";

export const info = async (ctx: Context, user: UsersEntity): Promise<void> => {

  const GroupName = user.Group ? user.Group.Name : "Не выбрана!";
  const GroupText = user.Group ? "" : "⚠Для автоматического получения важной информации по вашей группе рекомендуем выбрать группу в главном меню.";

  const NotificationStatus = user.NotificationStatus ? "✅Включены" : "❌Выключены";
  const NotificationText = user.NotificationStatus ? "" : "⚠Для получения важной информации рекомендуем включить уведомления.";
  const buttonText = user.NotificationStatus ? "❌Выключить уведомления" : "✅Включить уведомления";

  await sendOrEditMessage(ctx, `Ваша группа: ${GroupName}\nУведомления: ${NotificationStatus}\n\n${GroupText}\n\n${NotificationText}`,{
    reply_markup: {
      inline_keyboard: [
        [ { text: "🛎Посмотр замен", callback_data: "/replacements"}],
        [ { text: buttonText, callback_data: "/notification"} ],
        [ { text: `⬅В главное меню`, callback_data: `/start` }]
      ]
    }
  });
};

