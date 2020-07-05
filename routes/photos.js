'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('shohei');
});

router.get('/:title', (req, res, next) => {
  res.send(req.params.title);
});

module.exports = router;