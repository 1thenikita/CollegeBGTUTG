import { CronJob } from 'cron';
import { getRepository } from 'typeorm';
import { ReplacementsEntity } from "../database/entities/Replacements.entity";
import moment from "moment";
import { bot } from "../client";

const nightTimer = async () => {
  const replacementRepository = getRepository(ReplacementsEntity);

  const replacements = await replacementRepository.find();
  for (const replacement of replacements) {
    if(!replacement.Status){
      const dateStr = moment(replacement.Date, 'YYYY-MM-DD').locale('ru').format('DD MMMM');
      const users = await replacement.Group.getMembers(true);

      for(const user of users){
        await bot.telegram.sendMessage(user.ID, `Вашей группе выставили замену на ${dateStr}\nВместо предмета <b>${replacement.InsteadOfSubject.Name} (${replacement.InsteadOfTeacher.Name})</b> будет предмет <b>${replacement.ReplacingSubject.Name} (${replacement.ReplacingTeacher.Name}</b> на ${replacement.Pair} паре в кабинете ${replacement.Cabinet}`, { parse_mode: "HTML" });
        replacement.Status = true;

        await replacement.save();
      }
    }
  }
};

export const nightCron = new CronJob('30 0 0 * * *', nightTimer);
