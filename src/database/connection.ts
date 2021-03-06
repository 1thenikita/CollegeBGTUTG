import { createConnection } from 'typeorm';
import { UsersEntity } from './entities/Users.entity';
import { GroupsEntity} from "./entities/Groups.entity";
import { SpecialtiesEntity } from "./entities/Specialties.entity";
import { RolesEntity } from "./entities/Roles.entity";
import { ReplacementsEntity } from "./entities/Replacements.entity";
import {TeachersEntity} from "./entities/Teachers.entity";
import {SubjectsEntity} from "./entities/Subjects.entity";
import { startBot } from '../client';

import '../API/API';
import {SchedulesEntity} from "./entities/Schedules.entity";

createConnection({
    type: process.env.DB_TYPE as 'mssql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        UsersEntity,
        GroupsEntity,
        SpecialtiesEntity,
        RolesEntity,
        ReplacementsEntity,
        TeachersEntity,
        SubjectsEntity,
        SchedulesEntity,
    ],
    options: {
        encrypt: false,
    },
}).then(() => {
    // eslint-disable-next-line no-console
    console.log('Database ready');
    startBot();
    //
    // nightCron.start();
});
