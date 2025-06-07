const Product = require('../models/product.js');
// const User = require('../models/user.js');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.fetchAll()
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
    let totalQuantity = 1;
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
                totalQuantity = totalQuantity + product.cartItem.quantity;
                console.log('quantity = ' + totalQuantity);
                return product;
            }
            return Product.findById(productId);
        })
        .then(product => {
            console.log('quantity = ' + totalQuantity);
            return userCart.addProduct(product, {
                through: { quantity: totalQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => { console.log(err) })
};

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: {id: productId}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => { console.log(err) });
};

exports.postOrder = (req, res, next) => {
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts();
        }).then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity }
                        return product;
                    }));
                })
        })
        .then(result => {
            return userCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => { console.log(err) });
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => { console.log(err)});
};
