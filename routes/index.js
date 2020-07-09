'use strict';
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = '筋トレくん';
  if (req.user) {
    Schedule.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    }).then(schedules => {
      res.render('index', {
        title: title,
        user: req.user,
        schedules: schedules
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;