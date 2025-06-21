import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Product document
export interface IProduct extends Document {
    title: string;
    price: number;
    imageUrl: string;
    description: string;
    userId: mongoose.Types.ObjectId;
}

// Interface for Product model (static methods can be added here)
interface IProductModel extends Model<IProduct> {
    // Add any static methods here if needed
}

const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model<IProduct, IProductModel>('Product', productSchema);
