require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');
const sequelize = require('./util/database.js');

const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js');
const CartItem = require('./models/cart-item.js');
const Order = require('./models/order.js');
const OrderItem = require('./models/order-item.js');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {console.log(err);})
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize
    .sync()
    // .sync({alter: true})
    // .sync({force: true})
    .then(result => {
        return User.findByPk(1);
    }).then( user => {
        if (!user) {
            return User.create({ name: 'Juan Foo', email: 'juan@foo.net' });
        }
        return Promise.resolve(user);
    }).then( user => {
        user.getCart().then(cart => {
            if (cart) {
                return cart;
            }
            return user.createCart()
        })
    })
    .then( cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
