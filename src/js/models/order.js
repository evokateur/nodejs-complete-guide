const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderLineSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

orderLineSchema.virtual('product', {
    ref: 'Product',
    localField: 'productId',
    foreignField: '_id',
    justOne: true
});

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [ orderLineSchema ]
});

orderSchema.statics.createFromUserCart = function(user) {
    return user.getCart().then(cart => {
        const order = new this({
            userId: user._id,
            items: cart.items.map(item => ({
                productId: item.product.id,
                unitPrice: item.product.price,
                quantity: item.quantity
            }))
        });
        return order.save();
    });
};

orderSchema.statics.findByUserId = function(userId) {
    return this.find({ userId: userId }).populate('items.product');
};

module.exports = mongoose.model('Order', orderSchema);
