const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

cartItemSchema.virtual('product', {
    ref: 'Product',
    localField: 'productId',
    foreignField: '_id',
    justOne: true
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [ cartItemSchema ]
    }
});

userSchema.methods.addCartItem = function(product) {
    const itemIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === product.id.toString();
    });

    if (itemIndex > -1) {
        this.cart.items[itemIndex].quantity++;
    } else {
        const newItem = {
            productId: product.id,
            quantity: 1
        }
        this.cart.items.push(newItem);
    }

    return this.save();
};

userSchema.methods.removeCartItem = function(productId) {
    const itemIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === productId.toString();
    });

    if (itemIndex > -1) {
        this.cart.items.splice(itemIndex, 1);
    }

    return this.save();
};

userSchema.methods.getCart = function() {
    return this.populate('cart.items.product').then(() => this.cart );
};

userSchema.methods.clearCart = function() {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
