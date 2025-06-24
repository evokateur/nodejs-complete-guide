import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './product';
import { IUser } from './user';

// Interface for OrderLine subdocument
interface IOrderLine {
    productId: mongoose.Types.ObjectId;
    unitPrice: number;
    quantity: number;
    product?: IProduct; // This will be populated from the Product model
}

// Interface for Order document
export interface IOrder extends Document {
    id: string;
    userId: mongoose.Types.ObjectId;
    items: IOrderLine[];
}

// Interface for Order model with static methods
interface IOrderModel extends Model<IOrder> {
    createFromUserCart(user: IUser): Promise<IOrder>;
    findByUserId(userId: string | mongoose.Types.ObjectId): Promise<IOrder[]>;
}

const orderLineSchema = new Schema<IOrderLine>({
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

const orderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderLineSchema]
});

orderSchema.statics.createFromUserCart = function(
    this: Model<IOrder>,
    user: IUser
): Promise<IOrder> {
        return user.getCart().then(cart => {
            const order = new this({
                userId: user._id,
                items: cart.items.map(item => ({
                    productId: item.product!.id,
                    unitPrice: item.product!.price,
                    quantity: item.quantity
                }))
            });
            return order.save();
        });
    };

orderSchema.statics.findByUserId = function(
    this: Model<IOrder>,
    userId: string | mongoose.Types.ObjectId
): Promise<IOrder[]> {
        return this.find({ userId: userId }).populate('items.product');
    };

export default mongoose.model<IOrder, IOrderModel>('Order', orderSchema);
