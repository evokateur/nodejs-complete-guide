require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./src/controllers/error.js');
const mongoConnect = require('./src/util/database.js').mongoConnect;
const User = require('./src/models/user.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./src/routes/admin.js');
const shopRoutes = require('./src/routes/shop.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByUsername('default')
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user.id);
            next();
        })
        .catch(err => {console.log(err);})
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});
