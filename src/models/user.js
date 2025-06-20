const mongodb = require('mongodb');
const normalizeIds = require('./mongo-utils.js').normalizeIds;
const denormalizeIds = require('./mongo-utils.js').denormalizeIds;

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
            return item.product.id.toString() === product.id.toString();
        });

        if (cartItem) {
            cartItem.quantity++;
        } else {
            const newItem = {
                product: {id: product.id, title: product.title, price: product.price},
                quantity: 1
            }
            this.cart.items.push(newItem);
        }

        return this.saveCart();
    }

    removeCartItem(product) {
        const cartItem = this.cart.items.find(item => {
            return item.product.id.toString() === product.id.toString();
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
            {$set: {cart: normalizeIds(this.cart)}}
        ).catch(err => { console.log(err); });
    }

    getCart() {
        const db = getDb();

        return db.collection('users').findOne({ _id: new mongodb.ObjectId(this.id) })
            .then(user => {
                return user.cart ? normalizeIds(user.cart) : { items: [] };
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
        return db.collection('orders').insertOne({
            user: denormalizeIds({ id: this.id, email: this.email }),
            items: denormalizeIds(this.cart.items) 
        }) .catch(err => { console.log(err); });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders') .find({ 'user._id': new mongodb.ObjectId(this.id) }) .toArray()
            .then(orders =>  {
                return normalizeIds(orders);
            });
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
                user = normalizeIds(user);
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
                user = normalizeIds(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;
