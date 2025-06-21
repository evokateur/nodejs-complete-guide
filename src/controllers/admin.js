const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description

    const product = new Product({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    });

    product.save()
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: product 
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const price = req.body.price;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;

    const description = req.body.description;
    Product.findById(productId).then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
    }).then(result => {
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.findByIdAndDelete(productId).then(product => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}

exports.getProducts = (req, res, next) =>
{
    Product.find()
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));

};
