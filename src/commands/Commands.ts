import { UsersEntity } from '../database/entities/Users.entity';
import { userCommands } from './user';
import { Context } from "telegraf";

export type Command<T = boolean> = {
  description: string;
  database: T;
  params: string[];
  execute(ctx: Context, user: T extends true ? UsersEntity : null, ...params: string[]): void;
};

export type Commands<T = boolean> = {
  [name: string]: Command<T>;
};

export const Command: Commands = {
  ...userCommands,
};
