import { reqUsers } from '../config';
import { UsersEntity } from '../database/entities/Users.entity';
import { getRepository } from 'typeorm';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {bot} from "../client";
import { GroupsEntity } from "../database/entities/Groups.entity";
import {ReplacementsEntity} from "../database/entities/Replacements.entity";
import moment from "moment";

const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(bodyParser.json());
app.listen(process.env.PORT, function () {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${process.env.PORT}!`);
});

app.use((req, res, next) => {
  if (reqUsers.findIndex((t) => t.token == req.headers.authorization) == -1)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  next();
});

app.get('/tu/college/v1.0/status', async (req, res) => {
  res.json({
    success: true,
    message: "System ready",
  }).status(200);
});

app.get('/tu/college/v1.0/group/all', async (req, res) => {
  const groups = await getRepository(GroupsEntity).find();
  if (!groups)
    return res.json({
      success: false,
      message: 'No find groups',
    }).status(404);

  res.json({
    success: true,
    message: groups,
  }).status(200);
});

app.get('/tu/college/v1.0/user/:id', async (req, res) => {
  if (!req.params.id)
    return res.json({
      success: false,
      message: 'We need more params!',
    }).status(400);

  const user = await getRepository(UsersEntity).findOne({ ID: parseInt(req.params.id) });
  if (!user)
    return res.json({
      success: false,
      message: 'No find user',
    }).status(404);

  res.json({
    success: true,
    message: user,
  }).status(200);
});

app.post('/tu/college/v1.0/users/message/send', async (req, res) => {
  if (!req.query.text)
    return res.json({
      success: false,
      message: 'We need text in params!',
    }).status(400);

  const user = await getRepository(UsersEntity).find({ NotificationStatus: true });
  if (!user)
    return res.json({
      success: false,
      message: 'No find users with notifications turned on',
    }).status(404);

  for (let i = 0; i<user.length; i++){
    await bot.telegram.sendMessage(user[i].ID, `Отправлено общее сообщение из Учебной части\n\nСодержимое:\n${req.query.text.toString()}`)
  }

  res.json({
    success: true,
    message: `Message sending in ${user.length} peoples`,
    count: user.length,
  }).status(200);
});

app.post('/tu/college/v1.0/group/id=:groupId/message/send', async (req, res) => {
  if (!req.query.text || !req.params.groupId)
    return res.json({
      success: false,
      message: 'We need text in params!',
    }).status(400);

  const group = await getRepository(GroupsEntity).findOne({ ID: parseInt(req.params.groupId) });
  if(!group)
    return res.json({
    success: false,
    message: 'No find group',
  }).status(404);

  const users = await group.getMembers(true);
  if (users.length === 0)
    return res.json({
      success: false,
      message: 'No find users with notifications turned on',
    }).status(404);

  for (let i = 0; i < users.length; i++){
    if(users[i].NotificationStatus)
      await bot.telegram.sendMessage(users[i].ID, `Отправлено общее сообщение для Вашей группы из Учебной части\n\nСодержимое:\n${req.query.text.toString()}`)
  }

  res.json({
    success: true,
    message: `Message sending in ${users.length} peoples`,
  }).status(200);
});

app.post('/tu/college/v1.0/group/id=:groupId/replacement/id=:replacementId/send', async (req, res) => {
  if (!req.params.groupId || !req.params.replacementId || !req.query.mode)
    return res.json({
      success: false,
      message: 'We need text in params!',
    }).status(400);

  const group = await getRepository(GroupsEntity).findOne({ ID: parseInt(req.params.groupId) });
  if(!group)
    return res.json({
      success: false,
      message: 'No find group',
    }).status(404);

  const replacement = await getRepository(ReplacementsEntity).findOne({ID: parseInt(req.params.replacementId), Group: group});
  if(!replacement)
    return res.json({
      success: false,
      message: 'No find replacement',
    }).status(404);

  const users = await group.getMembers(true);
  if (users.length === 0)
    return res.json({
      success: false,
      message: 'No find users with notifications turned on',
    }).status(404);

  const dateStr = moment(replacement.Date, 'YYYY-MM-DD').locale('ru').format('DD MMMM');

  const textAdd = `Вашей группе выставили замену на ${dateStr}\nВместо предмета <b>${replacement.InsteadOfSubject.Name} (${replacement.InsteadOfTeacher.Name})</b> будет предмет <b>${replacement.ReplacingSubject.Name} (${replacement.ReplacingTeacher.Name})</b> на ${replacement.Pair} паре в кабинете ${replacement.Cabinet}`;
  const textEdit = `<b>Изменение замены</b>\n\nВашей группе изменили замену на ${dateStr}\nВместо предмета <b>${replacement.InsteadOfSubject.Name} (${replacement.InsteadOfTeacher.Name})</b> будет предмет <b>${replacement.ReplacingSubject.Name} (${replacement.ReplacingTeacher.Name})</b> на ${replacement.Pair} паре в кабинете ${replacement.Cabinet}`;
  const textRemove = `<b>Удаление замены</b>\n\nВашей группе <b>удалили замену</b> на ${dateStr}\nВместо предмета <b>${replacement.InsteadOfSubject.Name} (${replacement.InsteadOfTeacher.Name}) НЕ</b> будет предмета <b>${replacement.ReplacingSubject.Name} (${replacement.ReplacingTeacher.Name}</b> на ${replacement.Pair} паре в кабинете ${replacement.Cabinet}`;

  if(req.query.mode !== "delete" && replacement.Status)
    return res.json({
      success: false,
      message: 'Message already send',
    }).status(406);

  for (let i = 0; i < users.length; i++){
    if(users[i].NotificationStatus) {
      switch (req.query.mode.toString().toLowerCase()){
        case "add":{
          await bot.telegram.sendMessage(users[i].ID, textAdd, {parse_mode: "HTML"})
          break;
        }
        case "edit":{
          await bot.telegram.sendMessage(users[i].ID, textEdit, {parse_mode: "HTML"})
          break;
        }
        case "remove":{
          await bot.telegram.sendMessage(users[i].ID, textRemove, {parse_mode: "HTML"})
          break;
        }
        default:{
          return res.json({
            success: false,
            message: 'No find mode sending, Modes: add; edit; remove',
          }).status(404);
        }
      }
    }
  }

  res.json({
    success: true,
    message: `Message sending in ${users.length} peoples`,
  }).status(200);
});

app.post('/tu/college/v1.0/user/id=:id/message/send', async (req, res) => {
  if (!req.params.id || !req.query.text)
    return res.json({
      success: false,
      message: 'We need more params!',
    }).status(400);

  const user = await getRepository(UsersEntity).findOne({ ID: parseInt(req.params.id) });
  if(!user)
    return res.json({
      success: false,
      message: 'No find user',
    }).status(404);

  await bot.telegram.sendMessage(user.ID, `Вам отправлено сообщение из Учебной части\n\nСодержимое:\n${req.query.text.toString()}`)

  res.json({
    success: true,
    message: "Message sending",
  }).status(200);
});