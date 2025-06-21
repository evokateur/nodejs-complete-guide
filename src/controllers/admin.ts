import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const getAddProduct = (req: Request, res: Response, next: NextFunction): void => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

export const postAddProduct = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const title: string = req.body.title;
    const price: number = req.body.price;
    const imageUrl: string = req.body.imageUrl;
    const description: string = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    });

    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

export const getEditProduct = (req: Request, res: Response, next: NextFunction): void => {
    const id: string = req.params.id;

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

export const postEditProduct = (req: Request, res: Response, next: NextFunction): void => {
    const productId: string = req.body.productId;
    const price: number = req.body.price;
    const title: string = req.body.title;
    const imageUrl: string = req.body.imageUrl;
    const description: string = req.body.description;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

export const postDeleteProduct = (req: Request, res: Response, next: NextFunction): void => {
    const productId: string = req.body.productId;

    Product.findByIdAndDelete(productId)
        .then(product => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

export const getProducts = (req: Request, res: Response, next: NextFunction): void => {
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
