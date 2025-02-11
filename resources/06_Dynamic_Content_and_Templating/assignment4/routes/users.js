const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const data = require('./default');

router.get('/users', (req, res, next) => {
    const users = data.users;
    res.render('users', { users: users, pageTitle: 'Users' });
});

module.exports = router;
