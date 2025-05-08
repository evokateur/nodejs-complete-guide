const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    id = req.params.id;
    Product.findByPk(id)
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
    Product.findAll()
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
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    });
                })
                .catch(err => {console.log(err)});
        })
        .catch(err => { console.log(err)});
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({where: {id: productId}});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                newQuantity = product.cartItem.quantity + 1;
                return userCart.addProduct(product, {
                    through: { quantity: newQuantity }
                });
            }
            return Product.findByPk(productId)
                .then(product => {
                    return userCart.addProduct(product, {
                        through: { quantity: 1 }
                    });
                });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => { console.log(err) })
};

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
