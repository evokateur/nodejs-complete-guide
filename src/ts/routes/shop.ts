import express from 'express';

// Keep controller as require() for now - will convert when we do controllers
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCartItem);

router.post('/cart-delete-item', shopController.deleteCartItem);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

export default router;
