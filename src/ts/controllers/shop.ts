import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import User, { IUser } from '../models/user';
import Order from '../models/order';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
    user: IUser;
}

export const getProducts = (req: Request, res: Response, next: NextFunction): void => {
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

export const getProduct = (req: Request, res: Response, next: NextFunction): void => {
    const id: string = req.params.id;

    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

export const getIndex = (req: Request, res: Response, next: NextFunction): void => {
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

export const getCart = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    req.user.getCart()
        .then(cart => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cart: cart 
            });
        })
        .catch(err => {
            console.log(err);
        });
};

export const postCartItem = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const productId: string = req.body.productId;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                res.redirect('/cart');
                return Promise.resolve(null);
            }
            return req.user.addCartItem(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

export const deleteCartItem = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const productId: string = req.body.productId;

    req.user.removeCartItem(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

export const postOrder = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
};

export const getOrders = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    Order.findByUserId(req.user.id)
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        });
};
