require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error.js');
const User = require('./models/user.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../public')));

app.use((req, res, next) => {
    User.findOne({ username: 'default' })
        .then(user => {
            if (!user) {
                const user = new User({
                    username: 'default',
                    email: 'juan@foo.net',
                    cart: { items: [] }
                });
                return user.save();
            }
            return user;
        })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });
