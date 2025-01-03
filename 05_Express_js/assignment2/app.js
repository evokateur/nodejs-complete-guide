const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('Maximum verbosity.');
    next();
});

app.use('/users', (req, res, next) => {
  res.send('<h1>The "List of Users" Page</h1>');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello, footpad!</h1>');
});

app.listen(3000);
