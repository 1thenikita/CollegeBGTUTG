import dotenv from 'dotenv';

dotenv.config();

import './client';
import './database';
import './commands';

import { sendErrorLog } from './logs/error/error';

process.on('unhandledRejection', (reason: Error) => {
    // eslint-disable-next-line no-console
    console.log(reason);

    sendErrorLog(reason.name, reason.message);
});