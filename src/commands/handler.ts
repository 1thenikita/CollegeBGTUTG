import { bot } from '../client';
import { Command } from './Commands';
import { UsersEntity } from '../database/entities/Users.entity';
import Context from "telegraf";
import { getConfig } from "../config/config";

// @ts-ignore
const messageHandler = async (ctx: Context): Promise<void> => {
  if (ctx.message.text.toString()[0] !== getConfig().prefix) return;
  const [commandName, ...args] = ctx.message.text.substring(1).split(/\s+/g);
  const command = Command[commandName.toLowerCase()];

  if (!command) return;

  let user: UsersEntity | null;
  if (command.database) {
    user = (await UsersEntity.getOrCreateUser(
      ctx.message.chat.id,
    )) as UsersEntity;

  } else {
    user = null;
  }

  try {
    await command.execute(ctx, user, ...args);
  } catch (e) {
    ctx.telegram.sendMessage(ctx.message.chat.id, e).catch(() => {});
  }
};

// @ts-ignore
const callbackHandler = async (ctx: Context): Promise<void> => {
  if (ctx.callbackQuery.data.toString()[0] !== getConfig().prefix) return;
  const [commandName, ...args] = ctx.callbackQuery.data.substring(1).split(/\s+/g);
  const command = Command[commandName.toLowerCase()];

  if (!command) return;

  let user: UsersEntity | null;

  if (command.database) {
    user = (await UsersEntity.getOrCreateUser(
        ctx.callbackQuery.message.chat.id,
    )) as UsersEntity;
  } else {
    user = null;
  }

  await ctx.answerCbQuery();
  try {
    await command.execute(ctx, user, ...args);
  } catch (e) {
    ctx.telegram.sendMessage(ctx.callbackQuery.message.chat.id, e).catch(() => {});
  }
};

bot.on('text', messageHandler);
bot.on('callback_query', callbackHandler);
