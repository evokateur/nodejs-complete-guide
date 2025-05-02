const db = require('../util/database.js');
const Cart = require('./cart.js');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        if (this.id === null) {
            return db.execute(
                'insert into products (title, price, description, imageUrl) values (?, ?, ?, ?)',
                [
                    this.title,
                    this.price,
                    this.description,
                    this.imageUrl
                ]
            );
        } else {
            return db.execute(
                'update products set title = ?, price = ?, description = ?, imageUrl = ? where id = ?',
                [
                    this.title,
                    this.price,
                    this.description,
                    this.imageUrl,
                    this.id
                ]
            )
        }
    }

    static deleteById(id) {
        return db.execute('delete from products where id = ?', [id]);
    }

    static fetchAll() {
        return db.execute('select * from products');
    }

    static findById(id) {
        return db.execute('select * from products where id = ?', [id]);
    }
};
