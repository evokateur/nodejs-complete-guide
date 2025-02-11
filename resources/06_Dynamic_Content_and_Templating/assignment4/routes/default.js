const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const users = [];

router.get('/', (req, res, next) => {
    res.render('add-user', { pageTitle: 'Add User' });
});

router.post('/add-user', (req, res, next) => {
    users.push({ username: req.body.username});
    res.redirect('/');
});

exports.routes = router;
exports.users = users;
