const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const normalizeId = require('./mongo-utils.js').normalizeId;
const normalizeMany = require('./mongo-utils.js').normalizeMany;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart || { items: [] };
        if (id) {
            this.id = id;
        }
    }

    addCartItem(product) {
        const cartItem = this.cart.items.find(item => {
            return item.productId.toString() === product.id.toString();
        });

        if (cartItem) {
            cartItem.quantity++;
        } else {
            const newItem = {
                productId: new mongodb.ObjectId(product.id),
                quantity: 1
            }
            this.cart.items.push(newItem);
        }

        return this.saveCart();
    }

    removeCartItem(product) {
        const cartItem = this.cart.items.find(item => {
            return item.productId.toString() === product.id.toString();
        });

        if (cartItem) {
            this.cart.items.splice(this.cart.items.indexOf(cartItem), 1);
        }

        return this.saveCart();
    }

    saveCart() {
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this.id) },
            {$set: {cart: this.cart}}
        ).catch(err => { console.log(err); });
    }

    getCart() {
        const db = getDb();
        return db.collection('products').find({_id: { $in: this.cart.items.map(item => item.productId) } }).toArray()
            .then(products => {
                return products.map(product => {
                    return normalizeId({
                        ...product,
                        quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity
                    });
                });
            });
    }

    createOrderFromCart() {
        return this.saveCartAsOrder().then(() => {
            this.cart = { items: [] };
            return this.saveCart();
        });
    }

    saveCartAsOrder() {
        const db = getDb();
        return db.collection('orders').insertOne({ userId: new mongodb.ObjectId(this.id), ...this.cart })
            .catch(err => { console.log(err); });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders') .find({ userId: new mongodb.ObjectId(this.id) }) .toArray()
            .then(orders => Promise.all( // https://chatgpt.com/share/6846a6b3-1308-8012-ae24-c63334630a44
                orders.map(order =>
                    db.collection('products') .find({ _id: { $in: order.items.map(i => i.productId) } }) .toArray()
                    .then(products => {
                        order.items = products.map(product => {
                            const { _id, ...rest } = product;
                            return {
                                productId: _id,
                                ...rest,
                                quantity: order.items .find(i => i.productId.toString() === product._id.toString()).quantity,
                            };
                        });
                        return normalizeId(order);
                    })
                )
            ));
    }

    save() {
        const db = getDb();
        if (this.id) {
            return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this.id)},
                {$set: {
                    username: this.username,
                    email: this.email,
                    cart: this.cart
                }})
                .catch(err => {
                    console.log(err);
                });
        } else {
            return db.collection('users').insertOne(this)
                .catch(err => {
                    console.log(err);
                });
        }
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
            .then(user => {
                user = normalizeId(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findByUsername(username) {
        const db = getDb();
        return db.collection('users').findOne({ username: username })
            .then(user => {
                user = normalizeId(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;
