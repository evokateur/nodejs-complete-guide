const Product = require('../models/product.js');
const User = require('../models/user.js');
const Order = require('../models/order.js');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'Shop',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cart: cart 
            });
        })
        .catch(err => {console.log(err)});
};

exports.postCartItem = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .then(product => {
            return req.user.addCartItem(product);
        })
        .then(result => {
            res.redirect('/cart');
        });
};

exports.deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeCartItem(productId)
        .then(() => {
            res.redirect('/cart');
        })
};

exports.postOrder = (req, res, next) => {
    Order.createFromUserCart(req.user)
        .then(order => {
            return req.user.clearCart();
        })
        .then(user => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getOrders = (req, res, next) => {
    Order.findByUserId(req.user.id)
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => { console.log(err)});
};
