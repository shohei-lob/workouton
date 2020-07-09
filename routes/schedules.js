'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Schedule = require('../models/schedule');
const Menu = require('../models/menus');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const scheduleId = uuid.v4();
  const updatedAt = new Date();
  // 予定IDと更新日時を作成
  Schedule.create({
    scheduleId: scheduleId,
    scheduleName: req.body.scheduleName.slice(0, 255) || '（名称未設定）',
    memo: req.body.memo,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then((schedule) => {  // 予定をデーターベース内に保存
    const menuNames = req.body.menus.trim().split('\n').map((s) => s.trim()).filter((s) => s !== "");
    const menus = menuNames.map((m) => { return {
      menuName: m,
      scheduleId: schedule.scheduleId
    };});
    Menu.bulkCreate(menus).then(() => {
      res.redirect('/schedules/' + schedule.scheduleId);
    });    
  });
});

router.get('/:scheduleId', authenticationEnsurer, (req, res, next) => {
  Schedule.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      scheduleId: req.params.scheduleId
    },
    order: [['updatedAt', 'DESC']]
  }).then((schedule) => {
    if (schedule) {
        Menu.findAll({
          where: { scheduleId: schedule.scheduleId },
          order: [['menuId', 'ASC']]
        }).then((menus) => {
          res.render('schedule', {
            user: req.user,
            schedule: schedule,
            menus: menus,
            users: [req.user]
          });
        });
      } else {
        const err = new Error('指定された予定は見つかりません');
        err.status = 404
        next(err);
      }
    });
}); 

module.exports = router;