const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const normalizeId = require('./mongo-utils.js').normalizeId;
const normalizeMany = require('./mongo-utils.js').normalizeMany;

class Product {
    constructor(title, price, imageUrl, description, id) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        if (id) {
            this.id = id
        }
    }

    save() {
        const db = getDb();
        if (this.id) {
            return db.collection('products').updateOne({ _id: new mongodb.ObjectId(this.id)}, 
                {$set: {
                    title: this.title, 
                    price: this.price, 
                    imageUrl: this.imageUrl, 
                    description: this.description
                }})
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            return db.collection('products').insertOne(this)
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                products = normalizeMany(products);
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').findOne({ _id: new mongodb.ObjectId(id) })
            .then(product => {
                product = normalizeId(product);
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;
