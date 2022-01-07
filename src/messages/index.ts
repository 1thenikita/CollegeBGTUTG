import { Context } from 'telegraf';
import { ExtraEditMessageText, ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export const sendOrEditMessage = async (
  ctx: Context,
  text: string,
  extra: ExtraReplyMessage | undefined,
): Promise<void> => {
  try {
    const isCommandMessage = !ctx.callbackQuery;

    if (isCommandMessage) await ctx.reply(text, extra);
    else await  ctx.editMessageText(text, extra as ExtraEditMessageText);
  }
  catch (e) {
    await sendOrEditMessage(ctx, e, {
      reply_markup: {
        inline_keyboard: [[{ text: '⬅️В главное меню', callback_data: `/start` }]],
      },
    }).catch(() => {});
}
};
