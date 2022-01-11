import { Commands } from '../Commands';
import { info } from './info';
import { start } from "./start";
import { notification } from "./notification";
import { setgroup } from "./setgroup";
import { specialties } from "./specialties";
import { speciality } from "./speciality";
import { replacements } from "./replacements";
import { courses } from "./courses";
import {schedules} from "./schedules";

export const userCommands: Commands = {
  start: {
    params: [],
    database: true,
    description: 'Приветствие пользователя',
    execute: start,
  },
  info: {
    params: [],
    database: true,
    description: 'Информация о курсе',
    execute: info,
  },
  notification: {
    params: [],
    database: true,
    description: 'Изменяет настройку уведомлений',
    execute: notification,
  },
  setgroup: {
    params: ['ID группы'],
    database: true,
    description: 'Изменяет группу',
    execute: setgroup,
  },
  // groups: {
  //   params: [],
  //   database: false,
  //   description: 'Отображает группы',
  //   execute: groups,
  // },
  courses: {
    params: ['ID специальности'],
    database: false,
    description: 'Отображает курсы',
    execute: courses,
  },
  specialties: {
    params: [],
    database: false,
    description: 'Отображает специальности',
    execute: specialties,
  },
  speciality: {
    params: ['ID специальности', 'Номер курса'],
    database: false,
    description: 'Отображает группы по выбранной специальности',
    execute: speciality,
  },
  replacements: {
    params: ['Количество дней'],
    database: true,
    description: 'Отображает замену на выбранной группе',
    execute: replacements,
  },

  schedules: {
    params: ['Количество дней'],
    database: true,
    description: 'Отображает расписание на выбранной группе',
    execute: schedules,
  },
};
