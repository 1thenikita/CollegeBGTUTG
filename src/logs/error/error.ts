import { bot } from '../../client';
import { getConfig } from '../../config/config';

export const sendErrorLog = (title: string, text: string): void => {
    const textToSend = `Error: ${title}\n\nDescription:\n${text}`;

    bot.telegram.sendMessage(getConfig().chats.logChat.toString(), textToSend);
};