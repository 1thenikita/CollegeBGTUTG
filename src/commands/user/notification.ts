import { Context } from "telegraf";
import { UsersEntity } from '../../database/entities/Users.entity';

export const notification = async (ctx: Context, user: UsersEntity): Promise<void> => {
  user.NotificationStatus = !user.NotificationStatus;
  await user.save();


  const NotificationStatus = user.NotificationStatus ? "✅Включены" : "❌Выключены";
  const MotivationText = user.NotificationStatus ? "" : "⚠Для получения важной информации рекомендуем включить уведомления.";

  await ctx.telegram.sendMessage(user.ID, `Вы изменили параметр\nУведомления: ${NotificationStatus}\n\n${MotivationText}`);
};

