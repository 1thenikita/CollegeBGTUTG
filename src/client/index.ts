import { Telegraf } from 'telegraf';

export const bot = new Telegraf(process.env.TOKEN!);

export const startBot = async (): Promise<void> => {
    await bot.launch();
    await console.log('Bot ready');
};
