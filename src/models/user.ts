import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './product';

// Interface for CartItem subdocument
interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    product?: IProduct; // This will be populated from the Product model
}

// Interface for Cart
interface ICart {
    items: ICartItem[];
}

// Interface for User document
export interface IUser extends Document {
    username: string;
    email: string;
    cart: ICart;
    addCartItem(product: { id: string | mongoose.Types.ObjectId }): Promise<IUser>;
    removeCartItem(productId: string | mongoose.Types.ObjectId): Promise<IUser>;
    getCart(): Promise<ICart>;
    clearCart(): Promise<IUser>;
}

// Interface for User model (static methods can be added here)
interface IUserModel extends Model<IUser> {
    // Add any static methods here if needed
}

const cartItemSchema = new Schema<ICartItem>({
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

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [cartItemSchema]
    }
});

userSchema.methods.addCartItem = function(
    this: IUser, 
    product: { id: string | mongoose.Types.ObjectId }
): Promise<IUser> {
        const itemIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() === product.id.toString();
        });

        if (itemIndex > -1) {
            this.cart.items[itemIndex].quantity++;
        } else {
            const newItem: ICartItem = {
                productId: new mongoose.Types.ObjectId(product.id),
                quantity: 1
            };
            this.cart.items.push(newItem);
        }

        return this.save();
    };

userSchema.methods.removeCartItem = function(
    this: IUser, 
    productId: string | mongoose.Types.ObjectId
): Promise<IUser> {
        const itemIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() === productId.toString();
        });

        if (itemIndex > -1) {
            this.cart.items.splice(itemIndex, 1);
        }

        return this.save();
    };

userSchema.methods.getCart = function(this: IUser): Promise<ICart> {
    return this.populate('cart.items.product').then(() => this.cart);
};

userSchema.methods.clearCart = function(this: IUser): Promise<IUser> {
    this.cart.items = [];
    return this.save();
};

export default mongoose.model<IUser, IUserModel>('User', userSchema);
