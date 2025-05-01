const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) =>
{
    Product.fetchAll()
        .then(([rows, schema]) => {
            res.render('shop/product-list', {
                products: rows,
                pageTitle: 'Shop',
                path: '/products'
            });
        })
        .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) => {
    id = req.params.id;
    Product.findById(id, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProduct = cart.products.find(p => p.id === product.id);
                if (cartProduct) {
                    cartProducts.push({product: product, quantity: cartProduct.quantity});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
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
